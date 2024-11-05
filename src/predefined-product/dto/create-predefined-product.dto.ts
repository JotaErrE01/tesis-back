import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreatePredefinedProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  status: string;

  @IsNumber()
  @IsPositive()
  categoryId: number;
}

