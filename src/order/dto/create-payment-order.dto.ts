import { IsString, MinLength } from 'class-validator';

export class CreatePaymentOrderDto {

  @IsString()
  @MinLength(3)
  paypalClientId: string;
}
