import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: Record<string, string>, @Query() query: PaginationQueryDto) {
    if (user.role === Role.ADMIN) {
      return this.tasksService.findForAdmin(user.sub, query);
    }

    return this.tasksService.findMine(user.sub, query);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: Record<string, string>,
  ) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Patch()
  @Roles(Role.ADMIN)
  update(
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: Record<string, string>,
  ) {
    const { id } = updateTaskDto;
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Patch('status')
  updateStatus(
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser() user: Record<string, string>,
  ) {
    const { id } = updateStatusDto;
    return this.tasksService.updateStatus(id, updateStatusDto, user);
  }

  @Delete()
  @Roles(Role.ADMIN)
  remove(@Body() deleteTaskDto: DeleteTaskDto, @CurrentUser() user: Record<string, string>) {
    const { id } = deleteTaskDto;
    return this.tasksService.remove(id, user);
  }
}
