import { ValueObject } from "@/core/shared/domain/ValueObject";
import { InvalidMatchDateError } from "@/core/matches/domain/errors/MatchDomainErrors";

interface MatchDateProps {
  value: Date;
}

export class MatchDate extends ValueObject<MatchDateProps> {
  private constructor(props: MatchDateProps) {
    super(props);
  }

  public static createForNewMatch(dateInput: Date | string): MatchDate {
    const parsed = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (Number.isNaN(parsed.getTime())) {
      throw new InvalidMatchDateError("formato de fecha y hora no válido.");
    }

    if (parsed.getTime() <= Date.now()) {
      throw new InvalidMatchDateError("el partido debe programarse en una fecha y hora futura.");
    }

    return new MatchDate({ value: parsed });
  }

  public static fromPersistence(dateInput: Date | string): MatchDate {
    const parsed = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return new MatchDate({ value: parsed });
  }

  public get value(): Date {
    return this.props.value;
  }
}
