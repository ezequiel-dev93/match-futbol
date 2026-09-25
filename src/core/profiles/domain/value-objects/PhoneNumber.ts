import { ValueObject } from "@/core/shared/domain/ValueObject";
import { InvalidPhoneNumberError } from "@/core/profiles/domain/errors/ProfileDomainErrors";

interface PhoneNumberProps {
  value: string | null;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  private static readonly PHONE_REGEX = /^\+?[0-9\s-]{8,20}$/;

  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  public static create(raw?: string | null): PhoneNumber {
    if (!raw || raw.trim() === "") {
      return new PhoneNumber({ value: null });
    }

    const cleaned = raw.trim();
    if (!PhoneNumber.PHONE_REGEX.test(cleaned)) {
      throw new InvalidPhoneNumberError("debe contener entre 8 y 20 dígitos válidos.");
    }

    return new PhoneNumber({ value: cleaned });
  }

  /**
   * Regla de Negocio de Privacidad:
   * El teléfono es privado por defecto y solo se revela al propio dueño
   * o a usuarios con quienes exista una solicitud de partido aceptada.
   */
  public reveal(isAuthorized: boolean): string | null {
    if (!isAuthorized) {
      return null;
    }
    return this.props.value;
  }

  /**
   * Uso exclusivo para persistencia (Mappers de Base de Datos)
   */
  public toPersistence(): string | null {
    return this.props.value;
  }
}
