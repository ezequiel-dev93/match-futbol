import { DomainError } from "@/core/shared/domain/DomainError";

export class InvalidMatchSlotsError extends DomainError {
  constructor(reason: string) {
    super(`Cupos inválidos: ${reason}`, "MATCH.INVALID_SLOTS");
  }
}

export class InvalidMatchDateError extends DomainError {
  constructor(reason: string) {
    super(`Fecha de partido inválida: ${reason}`, "MATCH.INVALID_DATE");
  }
}

export class MatchFullError extends DomainError {
  constructor() {
    super("El partido ya tiene todos los cupos completos.", "MATCH.FULL");
  }
}

export class MatchNotOpenError extends DomainError {
  constructor(currentStatus: string) {
    super(`La publicación no admite modificaciones en su estado actual (${currentStatus}).`, "MATCH.NOT_OPEN");
  }
}

export class OrganizerCannotApplyError extends DomainError {
  constructor() {
    super("El organizador no puede postularse a su propia publicación.", "MATCH.ORGANIZER_CANNOT_APPLY");
  }
}

export class UnauthorizedMatchActionError extends DomainError {
  constructor() {
    super("Solo el creador del partido puede realizar esta acción.", "MATCH.UNAUTHORIZED");
  }
}

export class MatchNotFoundError extends DomainError {
  constructor(matchId: string) {
    super(`No se encontró el partido (${matchId}).`, "MATCH.NOT_FOUND");
  }
}
