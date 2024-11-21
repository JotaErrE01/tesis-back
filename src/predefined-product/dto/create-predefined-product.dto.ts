import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreatePredefinedProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  @IsPositive()
  category_id: number;
}

