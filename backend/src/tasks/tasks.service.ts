import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { Role } from '../common/enums/role.enum';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findForAdmin(adminId: string, query?: PaginationQueryDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const search = query?.search?.trim() ?? '';
    const normalizedStatus = search.toUpperCase();
    const where = {
      where: {
        OR: [
          { assignedUserId: adminId },
          { assignedUser: { createdById: adminId } },
        ],
        ...(search
          ? {
              AND: [
                {
                  OR: [
                    { title: { contains: search, mode: 'insensitive' as const } },
                    { description: { contains: search, mode: 'insensitive' as const } },
                    ...((normalizedStatus === TaskStatus.PENDING || normalizedStatus === TaskStatus.PROCESSING || normalizedStatus === TaskStatus.DONE)
                      ? [{ status: { equals: normalizedStatus as TaskStatus } }]
                      : []),
                    { assignedUser: { name: { contains: search, mode: 'insensitive' as const } } },
                  ],
                },
              ],
            }
          : {}),
      },
    };

    const [items, total] = await Promise.all([
      this.prismaService.task.findMany({
        ...where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.task.count(where),
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

  async findMine(userId: string, query?: PaginationQueryDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const search = query?.search?.trim() ?? '';
    const normalizedStatus = search.toUpperCase();
    const where = {
      where: {
        assignedUserId: userId,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } },
                ...((normalizedStatus === TaskStatus.PENDING || normalizedStatus === TaskStatus.PROCESSING || normalizedStatus === TaskStatus.DONE)
                  ? [{ status: { equals: normalizedStatus as TaskStatus } }]
                  : []),
              ],
            }
          : {}),
      },
    };

    const [items, total] = await Promise.all([
      this.prismaService.task.findMany({
        ...where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.task.count(where),
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

  async create(createTaskDto: CreateTaskDto, actor: Record<string, string>) {
    const assignedUser = createTaskDto.assignedUserId
      ? await this.usersService.findById(createTaskDto.assignedUserId)
      : null;

    const savedTask = await this.prismaService.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: (createTaskDto.status as TaskStatus | undefined) ?? TaskStatus.PENDING,
        assignedUserId: assignedUser?.id ?? null,
      },
    });

    await this.auditLogsService.create({
      actorId: actor.sub,
      actionType: 'TASK_CREATED',
      targetEntity: 'task',
      targetId: savedTask.id,
      summary: {
        title: savedTask.title,
        assignedUserId: savedTask.assignedUserId,
        status: savedTask.status,
      },
    });

    return this.findById(savedTask.id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, actor: Record<string, string>) {
    const existingTask = await this.findById(id);
    const previous = {
      title: existingTask.title,
      description: existingTask.description,
      status: existingTask.status,
      assignedUserId: existingTask.assignedUserId,
    };

    if (updateTaskDto.assignedUserId) {
      const assignedUser = await this.usersService.findById(updateTaskDto.assignedUserId);
      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: {
        ...(updateTaskDto.title !== undefined ? { title: updateTaskDto.title } : {}),
        ...(updateTaskDto.description !== undefined
          ? { description: updateTaskDto.description }
          : {}),
        ...(updateTaskDto.status !== undefined
          ? { status: updateTaskDto.status as TaskStatus }
          : {}),
        ...(updateTaskDto.assignedUserId !== undefined
          ? { assignedUserId: updateTaskDto.assignedUserId }
          : {}),
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.auditLogsService.create({
      actorId: actor.sub,
      actionType: 'TASK_UPDATED',
      targetEntity: 'task',
      targetId: updatedTask.id,
      summary: {
        before: previous,
        after: {
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          assignedUserId: updatedTask.assignedUserId,
        },
      },
    });

    return updatedTask;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto, actor: Record<string, string>) {
    const task = await this.findById(id);

    if (actor.role === Role.USER && task.assignedUserId !== actor.sub) {
      throw new ForbiddenException('You can only update your assigned tasks');
    }

    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: { status: updateStatusDto.status as TaskStatus },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.auditLogsService.create({
      actorId: actor.sub,
      actionType: 'TASK_STATUS_CHANGED',
      targetEntity: 'task',
      targetId: updatedTask.id,
      summary: {
        before: task.status,
        after: updatedTask.status,
      },
    });

    return updatedTask;
  }

  async remove(id: string, actor: Record<string, string>) {
    const task = await this.findById(id);

    await this.prismaService.task.delete({
      where: { id },
    });

    await this.auditLogsService.create({
      actorId: actor.sub,
      actionType: 'TASK_DELETED',
      targetEntity: 'task',
      targetId: id,
      summary: {
        title: task.title,
        assignedUserId: task.assignedUserId,
        status: task.status,
      },
    });

    return { success: true };
  }

  async findById(id: string) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
