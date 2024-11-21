import { CreateCartDto } from './create-cart.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateCartDto extends CreateCartDto {

  @IsInt()
  @IsPositive()
  @IsOptional()
  cartItemId?: number;
}
