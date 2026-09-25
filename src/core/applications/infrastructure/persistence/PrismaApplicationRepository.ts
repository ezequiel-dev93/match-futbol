import { db } from "@/prisma/db";
import { and } from "@prisma/orm-postgres/orm-client";
import { Application } from "@/core/applications/domain/entities/Application";
import {
  IApplicationReader,
  IApplicationWriter,
} from "@/core/applications/domain/ports/IApplicationRepository";
import { ApplicationMapper } from "@/core/applications/infrastructure/mappers/ApplicationMapper";

/**
 * Adaptador Secundario (Infraestructura):
 * Implementa IApplicationReader e IApplicationWriter usando Prisma 8 ORM (`db.orm.public.Application`).
 */
export class PrismaApplicationRepository
  implements IApplicationReader, IApplicationWriter
{
  public async findById(id: string): Promise<Application | null> {
    const row = await db.orm.public.Application.where((a) => a.id.eq(id))
      .include("applicant", (u) => u.select("alias", "position"))
      .first();

    if (!row) return null;
    return ApplicationMapper.toDomain(row);
  }

  public async findByPublicationAndApplicant(
    publicationId: string,
    applicantId: string
  ): Promise<Application | null> {
    const row = await db.orm.public.Application.where((a) =>
      and(a.publicationId.eq(publicationId), a.applicantId.eq(applicantId))
    ).first();

    if (!row) return null;
    return ApplicationMapper.toDomain(row);
  }

  public async findByPublicationId(publicationId: string): Promise<Application[]> {
    const rows = await db.orm.public.Application.where((a) =>
      a.publicationId.eq(publicationId)
    )
      .include("applicant", (u) => u.select("alias", "position"))
      .orderBy((a) => a.createdAt.asc())
      .all();

    return rows.map((row) => ApplicationMapper.toDomain(row));
  }

  public async create(application: Application): Promise<Application> {
    const data = ApplicationMapper.toPersistence(application);
    const created = await db.orm.public.Application.create(data);
    return ApplicationMapper.toDomain(created);
  }

  public async update(application: Application): Promise<Application> {
    const data = ApplicationMapper.toPersistence(application);
    const updatedRows = await db.orm.public.Application.where({
      id: application.id,
    }).update({
      status: data.status,
      message: data.message,
      updatedAt: data.updatedAt,
    });

    const updated = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;
    return ApplicationMapper.toDomain(updated ?? data);
  }
}
