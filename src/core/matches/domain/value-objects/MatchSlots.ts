import { ValueObject } from "@/core/shared/domain/ValueObject";
import { InvalidMatchSlotsError, MatchFullError } from "@/core/matches/domain/errors/MatchDomainErrors";

export type MatchModality = "FUTBOL_5" | "FUTBOL_7" | "FUTBOL_8" | "FUTBOL_11";

interface MatchSlotsProps {
  missingSlots: number;
  matchType: MatchModality;
}

const MAX_SLOTS_BY_MODALITY: Record<MatchModality, number> = {
  FUTBOL_5: 12,
  FUTBOL_7: 16,
  FUTBOL_8: 18,
  FUTBOL_11: 25,
};

export class MatchSlots extends ValueObject<MatchSlotsProps> {
  private constructor(props: MatchSlotsProps) {
    super(props);
  }

  public static create(missingSlots: number, matchType: MatchModality): MatchSlots {
    if (!Number.isInteger(missingSlots) || missingSlots < 0) {
      throw new InvalidMatchSlotsError("la cantidad de cupos no puede ser negativa.");
    }

    const maxAllowed = MAX_SLOTS_BY_MODALITY[matchType];
    if (missingSlots > maxAllowed) {
      throw new InvalidMatchSlotsError(
        `para ${matchType} no se pueden solicitar más de ${maxAllowed} jugadores.`
      );
    }

    return new MatchSlots({ missingSlots, matchType });
  }

  public get missingSlots(): number {
    return this.props.missingSlots;
  }

  public get isFull(): boolean {
    return this.props.missingSlots === 0;
  }

  public decrement(): MatchSlots {
    if (this.isFull) {
      throw new MatchFullError();
    }
    return new MatchSlots({
      missingSlots: this.props.missingSlots - 1,
      matchType: this.props.matchType,
    });
  }
}
