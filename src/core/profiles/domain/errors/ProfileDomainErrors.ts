import { DomainError } from "@/core/shared/domain/DomainError";

export class InvalidAliasError extends DomainError {
  constructor(reason: string) {
    super(`Alias inválido: ${reason}`, "PROFILE.INVALID_ALIAS");
  }
}

export class InvalidPhoneNumberError extends DomainError {
  constructor(reason: string) {
    super(`Número de teléfono inválido: ${reason}`, "PROFILE.INVALID_PHONE");
  }
}

export class AliasAlreadyTakenError extends DomainError {
  constructor(alias: string) {
    super(`El alias "${alias}" ya está en uso por otro jugador.`, "PROFILE.ALIAS_TAKEN");
  }
}

export class ProfileNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`No se encontró el perfil (${identifier}).`, "PROFILE.NOT_FOUND");
  }
}
