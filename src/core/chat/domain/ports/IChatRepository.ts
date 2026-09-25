import { ChatMessage } from "@/core/chat/domain/entities/ChatMessage";

/**
 * ISP (Interface Segregation Principle):
 * Puertos separados para lectura/autorización y escritura de mensajes.
 */
export interface IChatReader {
  isParticipantAuthorized(publicationId: string, userId: string): Promise<boolean>;
  findMessagesByPublicationId(
    publicationId: string,
    limit?: number
  ): Promise<ChatMessage[]>;
}

export interface IChatWriter {
  saveMessage(message: ChatMessage): Promise<ChatMessage>;
}
