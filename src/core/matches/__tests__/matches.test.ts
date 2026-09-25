import { describe, expect, it } from "vitest";
import { Match } from "@/core/matches/domain/entities/Match";
import {
  InvalidMatchDateError,
  InvalidMatchSlotsError,
  OrganizerCannotApplyError,
} from "@/core/matches/domain/errors/MatchDomainErrors";

describe("Core Matches Module (POO & Value Objects)", () => {
  const futureDate = new Date(Date.now() + 86400000);

  it("impide crear un partido con fecha en el pasado", () => {
    const pastDate = new Date(Date.now() - 86400000);
    expect(() =>
      Match.createNew({
        creatorId: "org-1",
        title: "Partido ayer",
        type: "LOOKING_FOR_PLAYERS",
        matchType: "FUTBOL_5",
        matchDate: pastDate,
        locationName: "Cancha Sur",
        missingSlots: 2,
      })
    ).toThrow(InvalidMatchDateError);
  });

  it("valida el límite máximo de cupos según la modalidad (5v5 vs 11v11)", () => {
    expect(() =>
      Match.createNew({
        creatorId: "org-1",
        title: "Fútbol 5 imposible",
        type: "LOOKING_FOR_PLAYERS",
        matchType: "FUTBOL_5",
        matchDate: futureDate,
        locationName: "Club Norte",
        missingSlots: 20,
      })
    ).toThrow(InvalidMatchSlotsError);
  });

  it("descuenta cupos con occupySlot y cambia automáticamente a FULL al llegar a 0", () => {
    const match = Match.createNew({
      creatorId: "org-1",
      title: "Falta 1 para las 20hs",
      type: "LOOKING_FOR_PLAYERS",
      matchType: "FUTBOL_5",
      matchDate: futureDate,
      locationName: "La Bombonerita",
      missingSlots: 1,
    });

    expect(match.status).toBe("OPEN");
    expect(() => match.occupySlot("org-1")).toThrow(OrganizerCannotApplyError);

    match.occupySlot("player-2");
    expect(match.missingSlots).toBe(0);
    expect(match.status).toBe("FULL");
  });
});