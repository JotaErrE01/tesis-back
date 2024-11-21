import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartDto {

  // @IsNotEmpty()
  // @IsArray()
  // @ValidateNested({ each: true }) // Valida cada elemento del arreglo
  // @Type(() => CartItemDto) // Especifica la clase para los elementos del arreglo
  // cartItems: Array<CartItemDto>;


  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

// class CartItemDto {
//   @IsNotEmpty()
//   @IsInt()
//   @IsPositive()
//   productId: number;

//   @IsNotEmpty()
//   @IsInt()
//   quantity: number;
// }