import { Entity } from "@/core/shared/domain/Entity";
import {
  ApplicationAlreadyResolvedError,
  UnauthorizedApplicationResolutionError,
} from "@/core/applications/domain/errors/ApplicationDomainErrors";
import { ApplicationMessage } from "@/core/applications/domain/value-objects/ApplicationMessage";

export type ApplicationDecisionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ApplicationProps {
  publicationId: string;
  applicantId: string;
  applicantAlias?: string;
  applicantPosition?: string | null;
  message: ApplicationMessage;
  status: ApplicationDecisionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Application extends Entity<ApplicationProps> {
  private constructor(id: string, props: ApplicationProps) {
    super(id, props);
  }

  public static createNew(params: {
    id?: string;
    publicationId: string;
    applicantId: string;
    message?: string | null;
  }): Application {
    const now = new Date();
    return new Application(params.id ?? crypto.randomUUID(), {
      publicationId: params.publicationId,
      applicantId: params.applicantId,
      message: ApplicationMessage.create(params.message),
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstitute(
    id: string,
    params: {
      publicationId: string;
      applicantId: string;
      applicantAlias?: string;
      applicantPosition?: string | null;
      message: string | null;
      status: ApplicationDecisionStatus;
      createdAt: Date | string;
      updatedAt: Date | string;
    }
  ): Application {
    return new Application(id, {
      publicationId: params.publicationId,
      applicantId: params.applicantId,
      applicantAlias: params.applicantAlias,
      applicantPosition: params.applicantPosition,
      message: ApplicationMessage.create(params.message),
      status: params.status,
      createdAt: params.createdAt instanceof Date ? params.createdAt : new Date(params.createdAt),
      updatedAt: params.updatedAt instanceof Date ? params.updatedAt : new Date(params.updatedAt),
    });
  }

  /**
   * Comportamiento POO: Acepta la solicitud validando permisos del organizador
   * y que la solicitud se encuentre en estado PENDING.
   */
  public accept(organizerId: string, matchCreatorId: string): void {
    this.ensureCanResolve(organizerId, matchCreatorId);
    this.props.status = "ACCEPTED";
    this.props.updatedAt = new Date();
  }

  /**
   * Comportamiento POO: Rechaza la solicitud validando permisos del organizador
   * y que la solicitud se encuentre en estado PENDING.
   */
  public reject(organizerId: string, matchCreatorId: string): void {
    this.ensureCanResolve(organizerId, matchCreatorId);
    this.props.status = "REJECTED";
    this.props.updatedAt = new Date();
  }

  private ensureCanResolve(organizerId: string, matchCreatorId: string): void {
    if (organizerId !== matchCreatorId) {
      throw new UnauthorizedApplicationResolutionError();
    }

    if (this.props.status !== "PENDING") {
      throw new ApplicationAlreadyResolvedError(this.props.status);
    }
  }

  public get publicationId(): string {
    return this.props.publicationId;
  }

  public get applicantId(): string {
    return this.props.applicantId;
  }

  public get applicantAlias(): string | undefined {
    return this.props.applicantAlias;
  }

  public get applicantPosition(): string | null | undefined {
    return this.props.applicantPosition;
  }

  public get message(): string | null {
    return this.props.message.value;
  }

  public get status(): ApplicationDecisionStatus {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
