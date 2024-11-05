import { PartialType } from '@nestjs/mapped-types';
import { CreatePredefinedProductDto } from './create-predefined-product.dto';

export class UpdatePredefinedProductDto extends PartialType(CreatePredefinedProductDto) {}
