import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsUUID('4', { message: 'Invalid task id' })
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
}
