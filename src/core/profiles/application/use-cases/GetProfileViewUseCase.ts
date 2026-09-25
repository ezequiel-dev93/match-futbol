import { ProfileNotFoundError } from "@/core/profiles/domain/errors/ProfileDomainErrors";
import { IProfileReader } from "@/core/profiles/domain/ports/IProfileRepository";
import { GetProfileViewInputDTO, ProfileViewDTO } from "@/core/profiles/application/dtos/ProfileDTO";

/**
 * Caso de Uso: Obtener la vista de un perfil respetando los dos niveles de privacidad:
 * 1. Público siempre (alias, foto, posición, zona)
 * 2. Privado hasta aceptación (teléfono de contacto)
 */
export class GetProfileViewUseCase {
  constructor(private readonly profileReader: IProfileReader) {}

  public async execute(input: GetProfileViewInputDTO): Promise<ProfileViewDTO> {
    const profile = await this.profileReader.findById(input.targetProfileId);

    if (!profile) {
      throw new ProfileNotFoundError(input.targetProfileId);
    }

    let hasAcceptedMatchWithViewer = false;

    if (input.viewerId && input.viewerId !== profile.id) {
      hasAcceptedMatchWithViewer = await this.profileReader.hasAcceptedMatchBetween(
        input.viewerId,
        profile.id
      );
    }

    return profile.toContextualView({
      viewerId: input.viewerId,
      hasAcceptedMatchWithViewer,
    });
  }
}
