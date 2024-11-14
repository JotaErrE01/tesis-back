import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  @IsString()
  @MinLength(2)
  @IsOptional()
  status?: Status;

}
