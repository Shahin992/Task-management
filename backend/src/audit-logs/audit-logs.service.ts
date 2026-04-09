import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(payload: {
    actorId: string;
    actionType: string;
    targetEntity: string;
    targetId: string;
    summary: Prisma.InputJsonValue;
  }) {
    return this.prismaService.auditLog.create({
      data: payload,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findMine(actorId: string, query?: PaginationQueryDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const where = { actorId };

    const [items, total] = await Promise.all([
      this.prismaService.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.auditLog.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        search: '',
      },
    };
  }
}
