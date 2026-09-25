import { MatchOutputDTO } from "@/core/matches/application/dtos/MatchDTO";
import { Match, MatchStatus, PublicationCategory } from "@/core/matches/domain/entities/Match";
import { MatchModality } from "@/core/matches/domain/value-objects/MatchSlots";

export interface RawPublicationRecord {
  id: string;
  creatorId: string;
  creator?: { alias: string } | null;
  title: string;
  description: string | null;
  type: PublicationCategory;
  matchType: MatchModality;
  matchDate: string | Date;
  locationName: string;
  locationLat: number | null;
  locationLng: number | null;
  missingSlots: number;
  allowsSubs: boolean;
  status: MatchStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export class MatchMapper {
  public static toDomain(raw: RawPublicationRecord): Match {
    return Match.reconstitute(raw.id, {
      creatorId: raw.creatorId,
      creatorAlias: raw.creator?.alias,
      title: raw.title,
      description: raw.description,
      type: raw.type,
      matchType: raw.matchType,
      matchDate: raw.matchDate,
      locationName: raw.locationName,
      locationLat: raw.locationLat,
      locationLng: raw.locationLng,
      missingSlots: raw.missingSlots,
      allowsSubs: raw.allowsSubs,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(match: Match) {
    return {
      id: match.id,
      creatorId: match.creatorId,
      title: match.title,
      description: match.description,
      type: match.type,
      matchType: match.matchType,
      matchDate: match.matchDate.toISOString(),
      locationName: match.locationName,
      locationLat: match.locationLat,
      locationLng: match.locationLng,
      missingSlots: match.missingSlots,
      allowsSubs: match.allowsSubs,
      status: match.status,
      createdAt: match.createdAt.toISOString(),
      updatedAt: match.updatedAt.toISOString(),
    };
  }

  public static toDTO(match: Match): MatchOutputDTO {
    return {
      id: match.id,
      creatorId: match.creatorId,
      creatorAlias: match.creatorAlias,
      title: match.title,
      description: match.description,
      type: match.type,
      matchType: match.matchType,
      matchDate: match.matchDate.toISOString(),
      locationName: match.locationName,
      locationLat: match.locationLat,
      locationLng: match.locationLng,
      missingSlots: match.missingSlots,
      allowsSubs: match.allowsSubs,
      status: match.status,
      createdAt: match.createdAt.toISOString(),
    };
  }
}
