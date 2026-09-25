import { Entity } from "@/core/shared/domain/Entity";
import { Alias } from "@/core/profiles/domain/value-objects/Alias";
import { PhoneNumber } from "@/core/profiles/domain/value-objects/PhoneNumber";

export interface ProfileProps {
  alias: Alias;
  avatarUrl: string | null;
  phone: PhoneNumber;
  position: string | null;
  zone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileViewDTO {
  id: string;
  alias: string;
  avatarUrl: string | null;
  phone: string | null;
  isPhoneVisible: boolean;
  position: string | null;
  zone: string | null;
  createdAt: Date;
}

export class Profile extends Entity<ProfileProps> {
  private constructor(id: string, props: ProfileProps) {
    super(id, props);
  }

  public static create(params: {
    id: string;
    alias: string;
    avatarUrl?: string | null;
    phone?: string | null;
    position?: string | null;
    zone?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Profile {
    const now = new Date();
    return new Profile(params.id, {
      alias: Alias.create(params.alias),
      avatarUrl: params.avatarUrl ?? null,
      phone: PhoneNumber.create(params.phone),
      position: params.position?.trim() || null,
      zone: params.zone?.trim() || null,
      createdAt: params.createdAt ?? now,
      updatedAt: params.updatedAt ?? now,
    });
  }

  public get alias(): string {
    return this.props.alias.value;
  }

  public get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  public get position(): string | null {
    return this.props.position;
  }

  public get zone(): string | null {
    return this.props.zone;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get rawPhoneForPersistence(): string | null {
    return this.props.phone.toPersistence();
  }

  /**
   * Proyecta el perfil aplicando la regla de negocio de visibilidad en dos niveles:
   * - Público siempre: alias, avatarUrl, position, zone
   * - Privado hasta aceptación: phone
   */
  public toContextualView(params: {
    viewerId?: string | null;
    hasAcceptedMatchWithViewer: boolean;
  }): ProfileViewDTO {
    const isOwner = Boolean(params.viewerId && params.viewerId === this.id);
    const isAuthorized = isOwner || params.hasAcceptedMatchWithViewer;
    const revealedPhone = this.props.phone.reveal(isAuthorized);

    return {
      id: this.id,
      alias: this.alias,
      avatarUrl: this.avatarUrl,
      phone: revealedPhone,
      isPhoneVisible: isAuthorized && revealedPhone !== null,
      position: this.position,
      zone: this.zone,
      createdAt: this.createdAt,
    };
  }
}
