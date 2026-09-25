import { Profile } from "@/core/profiles/domain/entities/Profile";

/**
 * ISP (Interface Segregation Principle):
 * Separamos las operaciones de lectura (Reader) de las de escritura (Writer).
 */
export interface IProfileReader {
  findById(id: string): Promise<Profile | null>;
  findByAlias(alias: string): Promise<Profile | null>;
  hasAcceptedMatchBetween(userAId: string, userBId: string): Promise<boolean>;
}

export interface IProfileWriter {
  save(profile: Profile): Promise<Profile>;
}
