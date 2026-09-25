import { ValueObject } from "@/core/shared/domain/ValueObject";
import { ApplicationMessageTooLongError } from "@/core/applications/domain/errors/ApplicationDomainErrors";

interface ApplicationMessageProps {
  value: string | null;
}

export class ApplicationMessage extends ValueObject<ApplicationMessageProps> {
  private static readonly MAX_LENGTH = 240;

  private constructor(props: ApplicationMessageProps) {
    super(props);
  }

  public static create(raw?: string | null): ApplicationMessage {
    if (!raw || raw.trim() === "") {
      return new ApplicationMessage({ value: null });
    }

    const trimmed = raw.trim();
    if (trimmed.length > ApplicationMessage.MAX_LENGTH) {
      throw new ApplicationMessageTooLongError(ApplicationMessage.MAX_LENGTH);
    }

    return new ApplicationMessage({ value: trimmed });
  }

  public get value(): string | null {
    return this.props.value;
  }
}
