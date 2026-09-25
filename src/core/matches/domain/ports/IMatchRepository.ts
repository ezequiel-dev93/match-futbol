import { Match, MatchStatus, PublicationCategory } from "@/core/matches/domain/entities/Match";
import { MatchModality } from "@/core/matches/domain/value-objects/MatchSlots";

export interface MatchQueryFilters {
  type?: PublicationCategory;
  matchType?: MatchModality;
  status?: MatchStatus;
  limit?: number;
}

/**
 * ISP (Interface Segregation Principle):
 * Separación entre lectura (Consultas del Feed) y escritura (Mutaciones).
 */
export interface IMatchReader {
  findById(id: string): Promise<Match | null>;
  findAll(filters?: MatchQueryFilters): Promise<Match[]>;
}

export interface IMatchWriter {
  create(match: Match): Promise<Match>;
  update(match: Match): Promise<Match>;
}
