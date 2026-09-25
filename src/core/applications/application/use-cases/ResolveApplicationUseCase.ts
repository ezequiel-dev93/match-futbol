import { MatchNotFoundError } from "@/core/matches/domain/errors/MatchDomainErrors";
import {
  IMatchReader,
  IMatchWriter,
} from "@/core/matches/domain/ports/IMatchRepository";
import { ApplicationNotFoundError } from "@/core/applications/domain/errors/ApplicationDomainErrors";
import {
  IApplicationReader,
  IApplicationWriter,
} from "@/core/applications/domain/ports/IApplicationRepository";
import { ApplicationMapper } from "@/core/applications/infrastructure/mappers/ApplicationMapper";
import {
  ApplicationOutputDTO,
  ResolveApplicationInputDTO,
} from "@/core/applications/application/dtos/ApplicationDTO";

/**
 * Caso de Uso: Aceptar o rechazar la solicitud de un jugador/equipo.
 * Al aceptar:
 * 1. La solicitud pasa a estado ACCEPTED.
 * 2. La entidad Match ocupa un cupo (occupySlot) y pasa a FULL si llega a 0.
 * 3. Queda habilitado automáticamente el contacto directo y el chat entre ambos.
 */
export class ResolveApplicationUseCase {
  constructor(
    private readonly applicationReader: IApplicationReader,
    private readonly applicationWriter: IApplicationWriter,
    private readonly matchReader: IMatchReader,
    private readonly matchWriter: IMatchWriter
  ) {}

  public async execute(
    input: ResolveApplicationInputDTO
  ): Promise<ApplicationOutputDTO> {
    const application = await this.applicationReader.findById(input.applicationId);
    if (!application) {
      throw new ApplicationNotFoundError(input.applicationId);
    }

    const match = await this.matchReader.findById(application.publicationId);
    if (!match) {
      throw new MatchNotFoundError(application.publicationId);
    }

    if (input.decision === "ACCEPT") {
      application.accept(input.organizerId, match.creatorId);
      match.occupySlot(application.applicantId);

      const updatedApp = await this.applicationWriter.update(application);
      await this.matchWriter.update(match);

      return ApplicationMapper.toDTO(updatedApp);
    }

    application.reject(input.organizerId, match.creatorId);
    const rejectedApp = await this.applicationWriter.update(application);
    return ApplicationMapper.toDTO(rejectedApp);
  }
}
