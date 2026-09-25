import { IMatchReader, MatchQueryFilters } from "@/core/matches/domain/ports/IMatchRepository";
import { MatchMapper } from "@/core/matches/infrastructure/mappers/MatchMapper";
import { MatchOutputDTO } from "@/core/matches/application/dtos/MatchDTO";

/**
 * Caso de Uso: Listar publicaciones de partidos para el Feed.
 */
export class ListMatchesUseCase {
  constructor(private readonly matchReader: IMatchReader) {}

  public async execute(filters?: MatchQueryFilters): Promise<MatchOutputDTO[]> {
    const matches = await this.matchReader.findAll(filters);
    return matches.map((match) => MatchMapper.toDTO(match));
  }
}
