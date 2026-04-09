import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateStatusDto {
  @IsUUID('4', { message: 'Invalid task id' })
  @IsNotEmpty({ message: 'Id is required' })
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
