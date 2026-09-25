import { DomainError } from "@/core/shared/domain/DomainError";

export class EmptyChatMessageError extends DomainError {
  constructor() {
    super("El mensaje no puede estar vacío.", "CHAT.EMPTY_MESSAGE");
  }
}

export class ChatMessageTooLongError extends DomainError {
  constructor(maxLength: number) {
    super(
      `El mensaje no puede superar los ${maxLength} caracteres.`,
      "CHAT.MESSAGE_TOO_LONG"
    );
  }
}

export class UnauthorizedChatAccessError extends DomainError {
  constructor() {
    super(
      "Acceso denegado: solo el organizador y los jugadores con solicitud aceptada pueden participar del chat de este partido.",
      "CHAT.UNAUTHORIZED_ACCESS"
    );
  }
}
