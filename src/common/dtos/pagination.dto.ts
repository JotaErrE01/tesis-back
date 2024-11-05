import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsPositive()
  @IsOptional()
  @Type(() => Number) // Transform the string into a number
  size?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // Transform the string into a number
  page?: number;
}