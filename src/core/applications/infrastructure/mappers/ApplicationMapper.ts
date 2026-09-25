import { ApplicationOutputDTO } from "@/core/applications/application/dtos/ApplicationDTO";
import {
  Application,
  ApplicationDecisionStatus,
} from "@/core/applications/domain/entities/Application";

export interface RawApplicationRecord {
  id: string;
  publicationId: string;
  applicantId: string;
  applicant?: {
    alias: string;
    position?: string | null;
  } | null;
  message: string | null;
  status: ApplicationDecisionStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export class ApplicationMapper {
  public static toDomain(raw: RawApplicationRecord): Application {
    return Application.reconstitute(raw.id, {
      publicationId: raw.publicationId,
      applicantId: raw.applicantId,
      applicantAlias: raw.applicant?.alias,
      applicantPosition: raw.applicant?.position,
      message: raw.message,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(application: Application) {
    return {
      id: application.id,
      publicationId: application.publicationId,
      applicantId: application.applicantId,
      message: application.message,
      status: application.status,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  }

  public static toDTO(application: Application): ApplicationOutputDTO {
    return {
      id: application.id,
      publicationId: application.publicationId,
      applicantId: application.applicantId,
      applicantAlias: application.applicantAlias,
      applicantPosition: application.applicantPosition,
      message: application.message,
      status: application.status,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  }
}
