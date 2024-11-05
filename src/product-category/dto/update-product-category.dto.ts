import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @IsString()
  @MinLength(2)
  @IsOptional()
  status?: string;
}
