import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(2)
  comentario: string;


  @IsNumber()
  @IsInt()
  @IsPositive()
  product_id: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => (value === null || value === undefined ? 1 : value))
  rating: number = 1;
}
