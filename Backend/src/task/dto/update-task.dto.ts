import { IsOptional, IsString, IsEnum } from 'class-validator';
import { status } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(status)
  status?: status;
}