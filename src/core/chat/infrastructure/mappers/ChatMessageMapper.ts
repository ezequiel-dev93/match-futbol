import { ChatMessageOutputDTO } from "@/core/chat/application/dtos/ChatDTO";
import { ChatMessage } from "@/core/chat/domain/entities/ChatMessage";

export interface RawChatMessageRecord {
  id: string;
  publicationId: string;
  senderId: string;
  sender?: {
    alias: string;
  } | null;
  content: string;
  createdAt: string | Date;
}

export class ChatMessageMapper {
  public static toDomain(raw: RawChatMessageRecord): ChatMessage {
    return ChatMessage.reconstitute(raw.id, {
      publicationId: raw.publicationId,
      senderId: raw.senderId,
      senderAlias: raw.sender?.alias,
      content: raw.content,
      createdAt: raw.createdAt,
    });
  }

  public static toPersistence(message: ChatMessage) {
    return {
      id: message.id,
      publicationId: message.publicationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    };
  }

  public static toDTO(message: ChatMessage): ChatMessageOutputDTO {
    return {
      id: message.id,
      publicationId: message.publicationId,
      senderId: message.senderId,
      senderAlias: message.senderAlias,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    };
  }
}
