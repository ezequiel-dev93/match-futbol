import { Profile } from "@/core/profiles/domain/entities/Profile";

export interface RawProfileRecord {
  id: string;
  alias: string;
  avatarUrl: string | null;
  phone: string | null;
  position: string | null;
  zone: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export class ProfileMapper {
  public static toDomain(raw: RawProfileRecord): Profile {
    return Profile.create({
      id: raw.id,
      alias: raw.alias,
      avatarUrl: raw.avatarUrl,
      phone: raw.phone,
      position: raw.position,
      zone: raw.zone,
      createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
      updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt : new Date(raw.updatedAt),
    });
  }

  public static toPersistence(profile: Profile) {
    return {
      id: profile.id,
      alias: profile.alias,
      avatarUrl: profile.avatarUrl,
      phone: profile.rawPhoneForPersistence,
      position: profile.position,
      zone: profile.zone,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
