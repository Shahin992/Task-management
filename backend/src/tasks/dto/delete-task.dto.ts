import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTaskDto {
  @IsUUID('4', { message: 'Invalid task id' })
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
}
