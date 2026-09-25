import {
  MatchNotFoundError,
  MatchNotOpenError,
  OrganizerCannotApplyError,
} from "@/core/matches/domain/errors/MatchDomainErrors";
import { IMatchReader } from "@/core/matches/domain/ports/IMatchRepository";
import { Application } from "@/core/applications/domain/entities/Application";
import { DuplicateApplicationError } from "@/core/applications/domain/errors/ApplicationDomainErrors";
import {
  IApplicationReader,
  IApplicationWriter,
} from "@/core/applications/domain/ports/IApplicationRepository";
import { ApplicationMapper } from "@/core/applications/infrastructure/mappers/ApplicationMapper";
import { ApplicationOutputDTO, ApplyToMatchInputDTO } from "@/core/applications/application/dtos/ApplicationDTO";

/**
 * Caso de Uso: Enviar una solicitud para sumarse a un partido.
 * Aplica SRP (Responsabilidad Única) y DIP (Inversión de Dependencias).
 */
export class ApplyToMatchUseCase {
  constructor(
    private readonly matchReader: IMatchReader,
    private readonly applicationReader: IApplicationReader,
    private readonly applicationWriter: IApplicationWriter
  ) {}

  public async execute(input: ApplyToMatchInputDTO): Promise<ApplicationOutputDTO> {
    const match = await this.matchReader.findById(input.publicationId);
    if (!match) {
      throw new MatchNotFoundError(input.publicationId);
    }

    if (match.creatorId === input.applicantId) {
      throw new OrganizerCannotApplyError();
    }

    if (match.status !== "OPEN") {
      throw new MatchNotOpenError(match.status);
    }

    const existing = await this.applicationReader.findByPublicationAndApplicant(
      input.publicationId,
      input.applicantId
    );

    if (existing) {
      throw new DuplicateApplicationError();
    }

    const application = Application.createNew({
      publicationId: input.publicationId,
      applicantId: input.applicantId,
      message: input.message,
    });

    const created = await this.applicationWriter.create(application);
    return ApplicationMapper.toDTO(created);
  }
}
