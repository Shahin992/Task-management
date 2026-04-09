import { Controller, Get, Post, Body, Patch, Delete, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: any, @Query() query: PaginationQueryDto) {
    if (user.role === Role.ADMIN) {
      return this.usersService.findAll(user.sub, query);
    }
    // Non-admins can only see themselves
    const currentUser = await this.usersService.findById(user.sub);
    return {
      items: currentUser ? [currentUser] : [],
      meta: {
        page: 1,
        limit: 1,
        total: currentUser ? 1 : 0,
        totalPages: 1,
        search: '',
      },
    };
  }

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.sub);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() admin: any,
  ) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      createdById: admin.sub,
    });

    await this.auditLogsService.create({
      actorId: admin.sub,
      actionType: 'USER_CREATED',
      targetEntity: 'User',
      targetId: user.id,
      summary: { email: user.email, role: user.role },
    });

    return user;
  }

  @Patch()
  @Roles(Role.ADMIN)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() admin: any,
  ) {
    const { id } = updateUserDto;
    const { id: _, ...updateData } = updateUserDto;
    const managedUser = await this.usersService.findManagedById(id, admin.sub);
    if (!managedUser) {
      throw new ForbiddenException('You can only update users you created');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await this.usersService.update(id, updateData);

    await this.auditLogsService.create({
      actorId: admin.sub,
      actionType: 'USER_UPDATED',
      targetEntity: 'User',
      targetId: user.id,
      summary: { email: user.email, role: user.role },
    });

    return user;
  }

  @Delete()
  @Roles(Role.ADMIN)
  async remove(@Body() deleteUserDto: DeleteUserDto, @CurrentUser() admin: any) {
    const { id } = deleteUserDto;
    const managedUser = await this.usersService.findManagedById(id, admin.sub);
    if (!managedUser) {
      throw new ForbiddenException('You can only delete users you created');
    }

    const user = await this.usersService.remove(id);

    await this.auditLogsService.create({
      actorId: admin.sub,
      actionType: 'USER_DELETED',
      targetEntity: 'User',
      targetId: user.id,
      summary: { email: user.email, name: user.name },
    });

    return user;
  }
}
