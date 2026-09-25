import { UnauthorizedChatAccessError } from "@/core/chat/domain/errors/ChatDomainErrors";
import { IChatReader } from "@/core/chat/domain/ports/IChatRepository";
import { ChatMessageMapper } from "@/core/chat/infrastructure/mappers/ChatMessageMapper";
import {
  ChatMessageOutputDTO,
  ListChatMessagesInputDTO,
} from "@/core/chat/application/dtos/ChatDTO";

/**
 * Caso de Uso: Obtener el historial de mensajes de la sala de chat de un partido.
 * Solo accesible para el organizador o postulantes con solicitud ACCEPTED.
 */
export class ListChatMessagesUseCase {
  constructor(private readonly chatReader: IChatReader) {}

  public async execute(
    input: ListChatMessagesInputDTO
  ): Promise<ChatMessageOutputDTO[]> {
    const isAuthorized = await this.chatReader.isParticipantAuthorized(
      input.publicationId,
      input.requesterId
    );

    if (!isAuthorized) {
      throw new UnauthorizedChatAccessError();
    }

    const messages = await this.chatReader.findMessagesByPublicationId(
      input.publicationId,
      input.limit
    );

    return messages.map((msg) => ChatMessageMapper.toDTO(msg));
  }
}
