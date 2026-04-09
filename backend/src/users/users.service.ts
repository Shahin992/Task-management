import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(createdById?: string, query?: PaginationQueryDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const search = query?.search?.trim() ?? '';
    const normalizedRole = search.toUpperCase();
    const where = {
      ...(createdById ? { createdById } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              ...((normalizedRole === Role.ADMIN || normalizedRole === Role.USER)
                ? [{ role: { equals: normalizedRole as Role } }]
                : []),
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdById: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        search,
      },
    };
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findManagedById(id: string, createdById: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        id,
        createdById,
      },
    });
  }

  createSeedUser(payload: Pick<User, 'email' | 'password' | 'name' | 'role'>): Promise<User> {
    return this.prismaService.user.create({
      data: payload,
    });
  }

  async countByRole(role: Role): Promise<number> {
    return this.prismaService.user.count({ where: { role } });
  }

  async create(data: any): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async update(id: string, data: any): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
