import { ApplicationDecisionStatus } from "@/core/applications/domain/entities/Application";

export interface ApplyToMatchInputDTO {
  publicationId: string;
  applicantId: string;
  message?: string | null;
}

export interface ResolveApplicationInputDTO {
  applicationId: string;
  organizerId: string;
  decision: "ACCEPT" | "REJECT";
}

export interface ApplicationOutputDTO {
  id: string;
  publicationId: string;
  applicantId: string;
  applicantAlias?: string;
  applicantPosition?: string | null;
  message: string | null;
  status: ApplicationDecisionStatus;
  createdAt: string;
  updatedAt: string;
}
