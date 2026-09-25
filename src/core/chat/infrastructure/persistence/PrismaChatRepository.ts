import { db } from "@/prisma/db";
import { and } from "@prisma/orm-postgres/orm-client";
import { ChatMessage } from "@/core/chat/domain/entities/ChatMessage";
import {
  IChatReader,
  IChatWriter,
} from "@/core/chat/domain/ports/IChatRepository";
import { ChatMessageMapper } from "@/core/chat/infrastructure/mappers/ChatMessageMapper";

/**
 * Adaptador Secundario (Infraestructura):
 * Implementa IChatReader e IChatWriter usando Prisma 8 ORM (`db.orm.public.Message`).
 */
export class PrismaChatRepository implements IChatReader, IChatWriter {
  public async isParticipantAuthorized(
    publicationId: string,
    userId: string
  ): Promise<boolean> {
    const publication = await db.orm.public.Publication.select(
      "id",
      "creatorId"
    ).first({ id: publicationId });

    if (!publication) {
      return false;
    }

    if (publication.creatorId === userId) {
      return true;
    }

    const acceptedApplication = await db.orm.public.Application.where((app) =>
      and(
        app.publicationId.eq(publicationId),
        app.applicantId.eq(userId),
        app.status.eq("ACCEPTED")
      )
    ).first();

    return Boolean(acceptedApplication);
  }

  public async findMessagesByPublicationId(
    publicationId: string,
    limit = 100
  ): Promise<ChatMessage[]> {
    const rows = await db.orm.public.Message.where((m) =>
      m.publicationId.eq(publicationId)
    )
      .include("sender", (s) => s.select("alias"))
      .orderBy((m) => m.createdAt.asc())
      .limit(limit)
      .all();

    return rows.map((row) => ChatMessageMapper.toDomain(row));
  }

  public async saveMessage(message: ChatMessage): Promise<ChatMessage> {
    const data = ChatMessageMapper.toPersistence(message);
    const created = await db.orm.public.Message.create(data);

    const rowWithSender = await db.orm.public.Message.where((m) =>
      m.id.eq(created.id)
    )
      .include("sender", (s) => s.select("alias"))
      .first();

    return ChatMessageMapper.toDomain(rowWithSender ?? created);
  }
}
