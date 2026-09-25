import { ChatMessage } from "@/core/chat/domain/entities/ChatMessage";
import { UnauthorizedChatAccessError } from "@/core/chat/domain/errors/ChatDomainErrors";
import {
  IChatReader,
  IChatWriter,
} from "@/core/chat/domain/ports/IChatRepository";
import { ChatMessageMapper } from "@/core/chat/infrastructure/mappers/ChatMessageMapper";
import {
  ChatMessageOutputDTO,
  SendChatMessageInputDTO,
} from "@/core/chat/application/dtos/ChatDTO";

/**
 * Caso de Uso: Enviar un mensaje en la sala de chat de un partido.
 * Verifica primero que el remitente sea el creador del partido o tenga una solicitud ACCEPTED.
 */
export class SendChatMessageUseCase {
  constructor(
    private readonly chatReader: IChatReader,
    private readonly chatWriter: IChatWriter
  ) {}

  public async execute(
    input: SendChatMessageInputDTO
  ): Promise<ChatMessageOutputDTO> {
    const isAuthorized = await this.chatReader.isParticipantAuthorized(
      input.publicationId,
      input.senderId
    );

    if (!isAuthorized) {
      throw new UnauthorizedChatAccessError();
    }

    const message = ChatMessage.createNew({
      publicationId: input.publicationId,
      senderId: input.senderId,
      content: input.content,
    });

    const saved = await this.chatWriter.saveMessage(message);
    return ChatMessageMapper.toDTO(saved);
  }
}
