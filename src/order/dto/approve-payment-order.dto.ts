import { IsString, MinLength } from 'class-validator';

export class ApprovePaymentOrderDto {
  @IsString()
  @MinLength(3)
  paypalClientId: string;

  @IsString()
  @MinLength(3)
  transactionId: string;
}
