import { MatchStatus, PublicationCategory } from "@/core/matches/domain/entities/Match";
import { MatchModality } from "@/core/matches/domain/value-objects/MatchSlots";

export interface CreateMatchInputDTO {
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
}

export interface MatchOutputDTO {
  id: string;
  creatorId: string;
  creatorAlias?: string;
  title: string;
  description: string | null;
  type: PublicationCategory;
  matchType: MatchModality;
  matchDate: string;
  locationName: string;
  locationLat: number | null;
  locationLng: number | null;
  missingSlots: number;
  allowsSubs: boolean;
  status: MatchStatus;
  createdAt: string;
}
