import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { StatusArsip } from '@prisma/client';

export class QueryArsipDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  subbagianId?: number;

  @IsOptional()
  @IsEnum(StatusArsip, {
    message: `status harus salah satu dari: ${Object.values(StatusArsip).join(', ')}`,
  })
  status?: StatusArsip;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}
