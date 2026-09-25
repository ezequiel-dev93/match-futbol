import { describe, expect, it } from "vitest";
import { Match } from "@/core/matches/domain/entities/Match";
import {
  IMatchReader,
  IMatchWriter,
} from "@/core/matches/domain/ports/IMatchRepository";
import { Application } from "@/core/applications/domain/entities/Application";
import {
  DuplicateApplicationError,
  UnauthorizedApplicationResolutionError,
} from "@/core/applications/domain/errors/ApplicationDomainErrors";
import {
  IApplicationReader,
  IApplicationWriter,
} from "@/core/applications/domain/ports/IApplicationRepository";
import { ApplyToMatchUseCase } from "@/core/applications/application/use-cases/ApplyToMatchUseCase";
import { ResolveApplicationUseCase } from "@/core/applications/application/use-cases/ResolveApplicationUseCase";

class InMemoryMatchRepo implements IMatchReader, IMatchWriter {
  public items = new Map<string, Match>();

  async findById(id: string): Promise<Match | null> {
    return this.items.get(id) ?? null;
  }

  async findAll(): Promise<Match[]> {
    return Array.from(this.items.values());
  }

  async create(m: Match): Promise<Match> {
    this.items.set(m.id, m);
    return m;
  }

  async update(m: Match): Promise<Match> {
    this.items.set(m.id, m);
    return m;
  }
}

class InMemoryAppRepo implements IApplicationReader, IApplicationWriter {
  public items = new Map<string, Application>();

  async findById(id: string): Promise<Application | null> {
    return this.items.get(id) ?? null;
  }

  async findByPublicationAndApplicant(
    pubId: string,
    appId: string
  ): Promise<Application | null> {
    for (const a of this.items.values()) {
      if (a.publicationId === pubId && a.applicantId === appId) return a;
    }
    return null;
  }

  async findByPublicationId(pubId: string): Promise<Application[]> {
    return Array.from(this.items.values()).filter(
      (a) => a.publicationId === pubId
    );
  }

  async create(a: Application): Promise<Application> {
    this.items.set(a.id, a);
    return a;
  }

  async update(a: Application): Promise<Application> {
    this.items.set(a.id, a);
    return a;
  }
}

describe("Core Applications Module (Matching Flow)", () => {
  it("procesa postulación, evita duplicados y al aceptar cierra el cupo del partido", async () => {
    const matchRepo = new InMemoryMatchRepo();
    const appRepo = new InMemoryAppRepo();

    const match = Match.createNew({
      id: "match-1",
      creatorId: "org-1",
      title: "Falta 1 arquero",
      type: "LOOKING_FOR_PLAYERS",
      matchType: "FUTBOL_7",
      matchDate: new Date(Date.now() + 86400000),
      locationName: "El Monumentalito",
      missingSlots: 1,
    });
    await matchRepo.create(match);

    const applyUseCase = new ApplyToMatchUseCase(matchRepo, appRepo, appRepo);
    const resolveUseCase = new ResolveApplicationUseCase(
      appRepo,
      appRepo,
      matchRepo,
      matchRepo
    );

    const createdApp = await applyUseCase.execute({
      publicationId: "match-1",
      applicantId: "dibu-23",
      message: "Atajo penales",
    });
    expect(createdApp.status).toBe("PENDING");

    await expect(
      applyUseCase.execute({
        publicationId: "match-1",
        applicantId: "dibu-23",
      })
    ).rejects.toThrow(DuplicateApplicationError);

    await expect(
      resolveUseCase.execute({
        applicationId: createdApp.id,
        organizerId: "impostor-99",
        decision: "ACCEPT",
      })
    ).rejects.toThrow(UnauthorizedApplicationResolutionError);

    const accepted = await resolveUseCase.execute({
      applicationId: createdApp.id,
      organizerId: "org-1",
      decision: "ACCEPT",
    });
    expect(accepted.status).toBe("ACCEPTED");

    const updatedMatch = await matchRepo.findById("match-1");
    expect(updatedMatch?.missingSlots).toBe(0);
    expect(updatedMatch?.status).toBe("FULL");
  });
});