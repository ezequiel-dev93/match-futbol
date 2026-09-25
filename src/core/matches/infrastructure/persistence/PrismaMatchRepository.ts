import { db } from "@/prisma/db";
import { Match } from "@/core/matches/domain/entities/Match";
import {
  IMatchReader,
  IMatchWriter,
  MatchQueryFilters,
} from "@/core/matches/domain/ports/IMatchRepository";
import { MatchMapper } from "@/core/matches/infrastructure/mappers/MatchMapper";

/**
 * Adaptador Secundario (Infraestructura):
 * Implementa IMatchReader e IMatchWriter usando Prisma 8 ORM (`db.orm.public.Publication`).
 */
export class PrismaMatchRepository implements IMatchReader, IMatchWriter {
  public async findById(id: string): Promise<Match | null> {
    const row = await db.orm.public.Publication.where((p) => p.id.eq(id))
      .include("creator", (c) => c.select("alias"))
      .first();

    if (!row) return null;
    return MatchMapper.toDomain(row);
  }

  public async findAll(filters?: MatchQueryFilters): Promise<Match[]> {
    let query = db.orm.public.Publication.include("creator", (c) =>
      c.select("alias")
    ).orderBy((p) => p.matchDate.asc());

    if (filters?.type) {
      const typeFilter = filters.type;
      query = query.where((p) => p.type.eq(typeFilter));
    }

    if (filters?.matchType) {
      const matchTypeFilter = filters.matchType;
      query = query.where((p) => p.matchType.eq(matchTypeFilter));
    }

    if (filters?.status) {
      const statusFilter = filters.status;
      query = query.where((p) => p.status.eq(statusFilter));
    }

    const rows = await query.limit(filters?.limit ?? 30).all();
    return rows.map((row) => MatchMapper.toDomain(row));
  }

  public async create(match: Match): Promise<Match> {
    const data = MatchMapper.toPersistence(match);
    const created = await db.orm.public.Publication.create(data);
    return MatchMapper.toDomain(created);
  }

  public async update(match: Match): Promise<Match> {
    const data = MatchMapper.toPersistence(match);
    const updatedRows = await db.orm.public.Publication.where({ id: match.id }).update({
      title: data.title,
      description: data.description,
      missingSlots: data.missingSlots,
      status: data.status,
      updatedAt: data.updatedAt,
    });

    const updated = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;
    return MatchMapper.toDomain(updated ?? data);
  }
}
