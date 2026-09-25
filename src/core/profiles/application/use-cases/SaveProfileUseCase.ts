import { Profile } from "@/core/profiles/domain/entities/Profile";
import { AliasAlreadyTakenError } from "@/core/profiles/domain/errors/ProfileDomainErrors";
import { IProfileReader, IProfileWriter } from "@/core/profiles/domain/ports/IProfileRepository";
import { SaveProfileInputDTO, ProfileViewDTO } from "@/core/profiles/application/dtos/ProfileDTO";

/**
 * Caso de Uso: Crear o actualizar el perfil de un jugador.
 * Aplica SRP (Single Responsibility) y DIP (Inversión de Dependencias).
 */
export class SaveProfileUseCase {
  constructor(
    private readonly profileReader: IProfileReader,
    private readonly profileWriter: IProfileWriter
  ) {}

  public async execute(input: SaveProfileInputDTO): Promise<ProfileViewDTO> {
    const existingWithAlias = await this.profileReader.findByAlias(input.alias.trim());

    if (existingWithAlias && existingWithAlias.id !== input.id) {
      throw new AliasAlreadyTakenError(input.alias);
    }

    const existingOwnProfile = await this.profileReader.findById(input.id);

    const profile = Profile.create({
      id: input.id,
      alias: input.alias,
      avatarUrl: input.avatarUrl,
      phone: input.phone,
      position: input.position,
      zone: input.zone,
      createdAt: existingOwnProfile?.createdAt ?? new Date(),
      updatedAt: new Date(),
    });

    const savedProfile = await this.profileWriter.save(profile);

    return savedProfile.toContextualView({
      viewerId: savedProfile.id,
      hasAcceptedMatchWithViewer: true,
    });
  }
}
