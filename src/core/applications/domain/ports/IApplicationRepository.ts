import { Application } from "@/core/applications/domain/entities/Application";

/**
 * ISP (Interface Segregation Principle):
 * Puertos de lectura y escritura separados para las solicitudes.
 */
export interface IApplicationReader {
  findById(id: string): Promise<Application | null>;
  findByPublicationAndApplicant(
    publicationId: string,
    applicantId: string
  ): Promise<Application | null>;
  findByPublicationId(publicationId: string): Promise<Application[]>;
}

export interface IApplicationWriter {
  create(application: Application): Promise<Application>;
  update(application: Application): Promise<Application>;
}
