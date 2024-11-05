import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitOfMesureDto } from './create-unit-of-mesure.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUnitOfMesureDto extends PartialType(CreateUnitOfMesureDto) {
  @IsString()
  @MinLength(1)
  @IsOptional()
  status?: string;
}
