import { describe, expect, it } from "vitest";
import { ChatMessage } from "@/core/chat/domain/entities/ChatMessage";
import {
  EmptyChatMessageError,
  UnauthorizedChatAccessError,
} from "@/core/chat/domain/errors/ChatDomainErrors";
import {
  IChatReader,
  IChatWriter,
} from "@/core/chat/domain/ports/IChatRepository";
import { SendChatMessageUseCase } from "@/core/chat/application/use-cases/SendChatMessageUseCase";

class InMemoryChatRepo implements IChatReader, IChatWriter {
  public messages: ChatMessage[] = [];
  public authorizedUsers = new Set<string>(["org-1", "accepted-player"]);

  async isParticipantAuthorized(
    _publicationId: string,
    userId: string
  ): Promise<boolean> {
    return this.authorizedUsers.has(userId);
  }

  async findMessagesByPublicationId(
    publicationId: string
  ): Promise<ChatMessage[]> {
    return this.messages.filter((m) => m.publicationId === publicationId);
  }

  async saveMessage(message: ChatMessage): Promise<ChatMessage> {
    this.messages.push(message);
    return message;
  }
}

describe("Core Chat Module (Post-Acceptance Authorization)", () => {
  it("bloquea a usuarios sin solicitud aceptada y permite chatear a los confirmados", async () => {
    const repo = new InMemoryChatRepo();
    const sendUseCase = new SendChatMessageUseCase(repo, repo);

    await expect(
      sendUseCase.execute({
        publicationId: "match-1",
        senderId: "stranger-99",
        content: "Hola, ¿puedo ir?",
      })
    ).rejects.toThrow(UnauthorizedChatAccessError);

    await expect(
      sendUseCase.execute({
        publicationId: "match-1",
        senderId: "accepted-player",
        content: "   ",
      })
    ).rejects.toThrow(EmptyChatMessageError);

    const msg = await sendUseCase.execute({
      publicationId: "match-1",
      senderId: "accepted-player",
      content: "¡Confirmado! Llevo pecheras.",
    });

    expect(msg.content).toBe("¡Confirmado! Llevo pecheras.");
  });
});