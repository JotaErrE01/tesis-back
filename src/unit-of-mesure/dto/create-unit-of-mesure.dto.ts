import { IsString, MinLength } from 'class-validator';

export class CreateUnitOfMesureDto {

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  abreviature: string;
}
