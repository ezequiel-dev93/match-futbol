import { Entity } from "@/core/shared/domain/Entity";
import { MessageContent } from "@/core/chat/domain/value-objects/MessageContent";

export interface ChatMessageProps {
  publicationId: string;
  senderId: string;
  senderAlias?: string;
  content: MessageContent;
  createdAt: Date;
}

export class ChatMessage extends Entity<ChatMessageProps> {
  private constructor(id: string, props: ChatMessageProps) {
    super(id, props);
  }

  public static createNew(params: {
    id?: string;
    publicationId: string;
    senderId: string;
    senderAlias?: string;
    content: string;
  }): ChatMessage {
    return new ChatMessage(params.id ?? crypto.randomUUID(), {
      publicationId: params.publicationId,
      senderId: params.senderId,
      senderAlias: params.senderAlias,
      content: MessageContent.create(params.content),
      createdAt: new Date(),
    });
  }

  public static reconstitute(
    id: string,
    params: {
      publicationId: string;
      senderId: string;
      senderAlias?: string;
      content: string;
      createdAt: Date | string;
    }
  ): ChatMessage {
    return new ChatMessage(id, {
      publicationId: params.publicationId,
      senderId: params.senderId,
      senderAlias: params.senderAlias,
      content: MessageContent.create(params.content),
      createdAt:
        params.createdAt instanceof Date
          ? params.createdAt
          : new Date(params.createdAt),
    });
  }

  public get publicationId(): string {
    return this.props.publicationId;
  }

  public get senderId(): string {
    return this.props.senderId;
  }

  public get senderAlias(): string | undefined {
    return this.props.senderAlias;
  }

  public get content(): string {
    return this.props.content.value;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
}
