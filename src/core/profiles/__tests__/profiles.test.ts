import { describe, expect, it } from "vitest";
import { Profile } from "@/core/profiles/domain/entities/Profile";
import {
  AliasAlreadyTakenError,
  InvalidAliasError,
  InvalidPhoneNumberError,
} from "@/core/profiles/domain/errors/ProfileDomainErrors";
import {
  IProfileReader,
  IProfileWriter,
} from "@/core/profiles/domain/ports/IProfileRepository";
import { SaveProfileUseCase } from "@/core/profiles/application/use-cases/SaveProfileUseCase";
import { GetProfileViewUseCase } from "@/core/profiles/application/use-cases/GetProfileViewUseCase";

class InMemoryProfileRepo implements IProfileReader, IProfileWriter {
  public items = new Map<string, Profile>();
  public acceptedMatches = new Set<string>();

  async findById(id: string): Promise<Profile | null> {
    return this.items.get(id) ?? null;
  }

  async findByAlias(alias: string): Promise<Profile | null> {
    for (const p of this.items.values()) {
      if (p.alias === alias) return p;
    }
    return null;
  }

  async hasAcceptedMatchBetween(userAId: string, userBId: string): Promise<boolean> {
    return (
      this.acceptedMatches.has(`${userAId}:${userBId}`) ||
      this.acceptedMatches.has(`${userBId}:${userAId}`)
    );
  }

  async save(profile: Profile): Promise<Profile> {
    this.items.set(profile.id, profile);
    return profile;
  }
}

describe("Core Profiles Module (POO & Hexagonal)", () => {
  it("valida correctamente el Value Object Alias y rechaza alias cortos", () => {
    expect(() => Profile.create({ id: "u1", alias: "ab" })).toThrow(
      InvalidAliasError
    );
  });

  it("valida correctamente el Value Object PhoneNumber", () => {
    expect(() =>
      Profile.create({ id: "u1", alias: "leo10", phone: "abc-invalido" })
    ).toThrow(InvalidPhoneNumberError);
  });

  it("oculta el teléfono a desconocidos y lo revela solo tras aceptar solicitud", async () => {
    const repo = new InMemoryProfileRepo();
    const saveUseCase = new SaveProfileUseCase(repo, repo);
    const getViewUseCase = new GetProfileViewUseCase(repo);

    await saveUseCase.execute({
      id: "user-1",
      alias: "el_diez",
      phone: "+5491122334455",
      position: "Enganche",
      zone: "Palermo",
    });

    const strangerView = await getViewUseCase.execute({
      targetProfileId: "user-1",
      viewerId: "user-2",
    });
    expect(strangerView.alias).toBe("el_diez");
    expect(strangerView.phone).toBeNull();
    expect(strangerView.isPhoneVisible).toBe(false);

    repo.acceptedMatches.add("user-1:user-2");
    const matchedView = await getViewUseCase.execute({
      targetProfileId: "user-1",
      viewerId: "user-2",
    });
    expect(matchedView.phone).toBe("+5491122334455");
    expect(matchedView.isPhoneVisible).toBe(true);
  });

  it("impide que dos jugadores distintos usen el mismo alias", async () => {
    const repo = new InMemoryProfileRepo();
    const saveUseCase = new SaveProfileUseCase(repo, repo);

    await saveUseCase.execute({ id: "user-1", alias: "campeon86" });

    await expect(
      saveUseCase.execute({ id: "user-2", alias: "campeon86" })
    ).rejects.toThrow(AliasAlreadyTakenError);
  });
});