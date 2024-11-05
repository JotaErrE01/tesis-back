import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  phone: string;

  @IsNumber()
  @IsPositive()
  paisId: number;

  @IsNumber()
  @IsPositive()
  cantonId: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsEmail()
  paypalEmail: string;

  @IsNumber()
  @IsPositive()
  roleId: number;
}
