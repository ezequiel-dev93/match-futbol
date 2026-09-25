import { DomainError } from "@/core/shared/domain/DomainError";

export class ApplicationMessageTooLongError extends DomainError {
  constructor(maxLength: number) {
    super(
      `El mensaje de solicitud no puede superar los ${maxLength} caracteres.`,
      "APPLICATION.MESSAGE_TOO_LONG"
    );
  }
}

export class DuplicateApplicationError extends DomainError {
  constructor() {
    super("Ya enviaste una solicitud para este partido.", "APPLICATION.DUPLICATE");
  }
}

export class ApplicationNotFoundError extends DomainError {
  constructor(applicationId: string) {
    super(`No se encontró la solicitud (${applicationId}).`, "APPLICATION.NOT_FOUND");
  }
}

export class ApplicationAlreadyResolvedError extends DomainError {
  constructor(currentStatus: string) {
    super(
      `Esta solicitud ya fue procesada previamente (estado: ${currentStatus}).`,
      "APPLICATION.ALREADY_RESOLVED"
    );
  }
}

export class UnauthorizedApplicationResolutionError extends DomainError {
  constructor() {
    super(
      "Solo el organizador del partido puede aceptar o rechazar solicitudes.",
      "APPLICATION.UNAUTHORIZED_RESOLUTION"
    );
  }
}
