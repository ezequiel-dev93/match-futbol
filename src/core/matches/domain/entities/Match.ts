import { Entity } from "@/core/shared/domain/Entity";
import {
  MatchFullError,
  MatchNotOpenError,
  OrganizerCannotApplyError,
  UnauthorizedMatchActionError,
} from "@/core/matches/domain/errors/MatchDomainErrors";
import { MatchDate } from "@/core/matches/domain/value-objects/MatchDate";
import { MatchModality, MatchSlots } from "@/core/matches/domain/value-objects/MatchSlots";

export type PublicationCategory = "LOOKING_FOR_PLAYERS" | "LOOKING_FOR_RIVAL";
export type MatchStatus = "OPEN" | "FULL" | "CANCELLED" | "COMPLETED";

export interface MatchProps {
  creatorId: string;
  creatorAlias?: string;
  title: string;
  description: string | null;
  type: PublicationCategory;
  matchType: MatchModality;
  matchDate: MatchDate;
  locationName: string;
  locationLat: number | null;
  locationLng: number | null;
  slots: MatchSlots;
  allowsSubs: boolean;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Match extends Entity<MatchProps> {
  private constructor(id: string, props: MatchProps) {
    super(id, props);
  }

  public static createNew(params: {
    id?: string;
    creatorId: string;
    title: string;
    description?: string | null;
    type: PublicationCategory;
    matchType: MatchModality;
    matchDate: Date | string;
    locationName: string;
    locationLat?: number | null;
    locationLng?: number | null;
    missingSlots: number;
    allowsSubs?: boolean;
  }): Match {
    const now = new Date();
    const slots = MatchSlots.create(params.missingSlots, params.matchType);

    if (slots.isFull) {
      throw new MatchFullError();
    }

    return new Match(params.id ?? crypto.randomUUID(), {
      creatorId: params.creatorId,
      title: params.title.trim(),
      description: params.description?.trim() || null,
      type: params.type,
      matchType: params.matchType,
      matchDate: MatchDate.createForNewMatch(params.matchDate),
      locationName: params.locationName.trim(),
      locationLat: params.locationLat ?? null,
      locationLng: params.locationLng ?? null,
      slots,
      allowsSubs: params.allowsSubs ?? false,
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstitute(
    id: string,
    params: {
      creatorId: string;
      creatorAlias?: string;
      title: string;
      description: string | null;
      type: PublicationCategory;
      matchType: MatchModality;
      matchDate: Date | string;
      locationName: string;
      locationLat: number | null;
      locationLng: number | null;
      missingSlots: number;
      allowsSubs: boolean;
      status: MatchStatus;
      createdAt: Date | string;
      updatedAt: Date | string;
    }
  ): Match {
    return new Match(id, {
      creatorId: params.creatorId,
      creatorAlias: params.creatorAlias,
      title: params.title,
      description: params.description,
      type: params.type,
      matchType: params.matchType,
      matchDate: MatchDate.fromPersistence(params.matchDate),
      locationName: params.locationName,
      locationLat: params.locationLat,
      locationLng: params.locationLng,
      slots: MatchSlots.create(params.missingSlots, params.matchType),
      allowsSubs: params.allowsSubs,
      status: params.status,
      createdAt: params.createdAt instanceof Date ? params.createdAt : new Date(params.createdAt),
      updatedAt: params.updatedAt instanceof Date ? params.updatedAt : new Date(params.updatedAt),
    });
  }

  /**
   * Comportamiento POO: Ocupa un cupo cuando el organizador acepta una solicitud.
   * Si los cupos llegan a 0, cambia automáticamente el estado a FULL.
   */
  public occupySlot(applicantId: string): void {
    if (this.props.creatorId === applicantId) {
      throw new OrganizerCannotApplyError();
    }

    if (this.props.status !== "OPEN") {
      throw new MatchNotOpenError(this.props.status);
    }

    this.props.slots = this.props.slots.decrement();
    this.props.updatedAt = new Date();

    if (this.props.slots.isFull) {
      this.props.status = "FULL";
    }
  }

  public cancel(requesterId: string): void {
    if (this.props.creatorId !== requesterId) {
      throw new UnauthorizedMatchActionError();
    }

    this.props.status = "CANCELLED";
    this.props.updatedAt = new Date();
  }

  public get creatorId(): string {
    return this.props.creatorId;
  }

  public get creatorAlias(): string | undefined {
    return this.props.creatorAlias;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string | null {
    return this.props.description;
  }

  public get type(): PublicationCategory {
    return this.props.type;
  }

  public get matchType(): MatchModality {
    return this.props.matchType;
  }

  public get matchDate(): Date {
    return this.props.matchDate.value;
  }

  public get locationName(): string {
    return this.props.locationName;
  }

  public get locationLat(): number | null {
    return this.props.locationLat;
  }

  public get locationLng(): number | null {
    return this.props.locationLng;
  }

  public get missingSlots(): number {
    return this.props.slots.missingSlots;
  }

  public get allowsSubs(): boolean {
    return this.props.allowsSubs;
  }

  public get status(): MatchStatus {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
