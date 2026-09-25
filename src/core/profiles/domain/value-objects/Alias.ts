import { ValueObject } from "@/core/shared/domain/ValueObject";
import { InvalidAliasError } from "@/core/profiles/domain/errors/ProfileDomainErrors";

interface AliasProps {
  value: string;
}

export class Alias extends ValueObject<AliasProps> {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 24;
  private static readonly VALID_PATTERN = /^[a-zA-Z0-9_.-]+$/;

  private constructor(props: AliasProps) {
    super(props);
  }

  public static create(raw: string): Alias {
    const trimmed = raw.trim();

    if (trimmed.length < Alias.MIN_LENGTH) {
      throw new InvalidAliasError(`debe tener al menos ${Alias.MIN_LENGTH} caracteres.`);
    }

    if (trimmed.length > Alias.MAX_LENGTH) {
      throw new InvalidAliasError(`no puede superar los ${Alias.MAX_LENGTH} caracteres.`);
    }

    if (!Alias.VALID_PATTERN.test(trimmed)) {
      throw new InvalidAliasError("solo puede contener letras, números, guiones, puntos o guiones bajos.");
    }

    return new Alias({ value: trimmed });
  }

  public get value(): string {
    return this.props.value;
  }
}
