import { db } from "@/prisma/db";
import { and, or } from "@prisma/orm-postgres/orm-client";
import { Profile } from "@/core/profiles/domain/entities/Profile";
import { IProfileReader, IProfileWriter } from "@/core/profiles/domain/ports/IProfileRepository";
import { ProfileMapper } from "@/core/profiles/infrastructure/mappers/ProfileMapper";

/**
 * Adaptador Secundario (Infraestructura):
 * Implementa los puertos de lectura y escritura usando Prisma 8 ORM.
 */
export class PrismaProfileRepository implements IProfileReader, IProfileWriter {
  public async findById(id: string): Promise<Profile | null> {
    const row = await db.orm.public.Profile.first({ id });
    if (!row) return null;
    return ProfileMapper.toDomain(row);
  }

  public async findByAlias(alias: string): Promise<Profile | null> {
    const row = await db.orm.public.Profile.where((p) => p.alias.eq(alias)).first();
    if (!row) return null;
    return ProfileMapper.toDomain(row);
  }

  public async hasAcceptedMatchBetween(userAId: string, userBId: string): Promise<boolean> {
    const acceptedApp = await db.orm.public.Application.where((app) =>
      and(
        app.status.eq("ACCEPTED"),
        or(
          and(
            app.applicantId.eq(userAId),
            app.publication.some((pub) => pub.creatorId.eq(userBId))
          ),
          and(
            app.applicantId.eq(userBId),
            app.publication.some((pub) => pub.creatorId.eq(userAId))
          )
        )
      )
    ).first();

    return Boolean(acceptedApp);
  }

  public async save(profile: Profile): Promise<Profile> {
    const data = ProfileMapper.toPersistence(profile);

    const saved = await db.orm.public.Profile.upsert({
      create: data,
      update: {
        alias: data.alias,
        avatarUrl: data.avatarUrl,
        phone: data.phone,
        position: data.position,
        zone: data.zone,
        updatedAt: data.updatedAt,
      },
    });

    return ProfileMapper.toDomain(saved);
  }
}
