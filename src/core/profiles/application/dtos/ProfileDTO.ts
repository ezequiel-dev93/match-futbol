import { ProfileViewDTO } from "@/core/profiles/domain/entities/Profile";

export interface SaveProfileInputDTO {
  id: string;
  alias: string;
  avatarUrl?: string | null;
  phone?: string | null;
  position?: string | null;
  zone?: string | null;
}

export interface GetProfileViewInputDTO {
  targetProfileId: string;
  viewerId?: string | null;
}

export type { ProfileViewDTO };
