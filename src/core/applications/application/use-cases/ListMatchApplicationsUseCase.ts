import { IApplicationReader } from "@/core/applications/domain/ports/IApplicationRepository";
import { ApplicationMapper } from "@/core/applications/infrastructure/mappers/ApplicationMapper";
import { ApplicationOutputDTO } from "@/core/applications/application/dtos/ApplicationDTO";

/**
 * Caso de Uso: Listar todas las solicitudes recibidas para una publicación de partido.
 */
export class ListMatchApplicationsUseCase {
  constructor(private readonly applicationReader: IApplicationReader) {}

  public async execute(publicationId: string): Promise<ApplicationOutputDTO[]> {
    const applications = await this.applicationReader.findByPublicationId(publicationId);
    return applications.map((app) => ApplicationMapper.toDTO(app));
  }
}
