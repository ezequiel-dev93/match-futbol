import { ValueObject } from "@/core/shared/domain/ValueObject";
import {
  ChatMessageTooLongError,
  EmptyChatMessageError,
} from "@/core/chat/domain/errors/ChatDomainErrors";

interface MessageContentProps {
  value: string;
}

export class MessageContent extends ValueObject<MessageContentProps> {
  private static readonly MAX_LENGTH = 1000;

  private constructor(props: MessageContentProps) {
    super(props);
  }

  public static create(raw: string): MessageContent {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      throw new EmptyChatMessageError();
    }

    if (trimmed.length > MessageContent.MAX_LENGTH) {
      throw new ChatMessageTooLongError(MessageContent.MAX_LENGTH);
    }

    return new MessageContent({ value: trimmed });
  }

  public get value(): string {
    return this.props.value;
  }
}
