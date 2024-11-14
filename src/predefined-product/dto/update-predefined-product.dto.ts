import { PartialType } from '@nestjs/mapped-types';
import { CreatePredefinedProductDto } from './create-predefined-product.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdatePredefinedProductDto extends PartialType(CreatePredefinedProductDto) {
  @IsString()
  @MinLength(2)
  @IsOptional()
  status?: Status;
}
