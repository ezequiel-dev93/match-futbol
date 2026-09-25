import { Match } from "@/core/matches/domain/entities/Match";
import { IMatchWriter } from "@/core/matches/domain/ports/IMatchRepository";
import { MatchMapper } from "@/core/matches/infrastructure/mappers/MatchMapper";
import { CreateMatchInputDTO, MatchOutputDTO } from "@/core/matches/application/dtos/MatchDTO";

/**
 * Caso de Uso: Publicar un nuevo partido ("Busco Jugadores" o "Busco Rival").
 * Aplica SRP (Responsabilidad Única) y DIP (Inversión de Dependencias).
 */
export class CreateMatchUseCase {
  constructor(private readonly matchWriter: IMatchWriter) {}

  public async execute(input: CreateMatchInputDTO): Promise<MatchOutputDTO> {
    const match = Match.createNew({
      creatorId: input.creatorId,
      title: input.title,
      description: input.description,
      type: input.type,
      matchType: input.matchType,
      matchDate: input.matchDate,
      locationName: input.locationName,
      locationLat: input.locationLat,
      locationLng: input.locationLng,
      missingSlots: input.missingSlots,
      allowsSubs: input.allowsSubs,
    });

    const created = await this.matchWriter.create(match);
    return MatchMapper.toDTO(created);
  }
}
