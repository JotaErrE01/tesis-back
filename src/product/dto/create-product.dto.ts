import { Transform } from 'class-transformer';
import { IsAlpha, IsAlphanumeric, IsInt, IsNumber, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(4)
  description: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  stock: number;

  // @IsString()
  // image: string;

  @IsString()
  status: string;

  @IsPositive()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  user: number;

  @IsPositive()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  predefinedProduct: number;

  @IsPositive()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  unitOfMeasure: number;

  @IsPositive()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  sellerId: number;
}