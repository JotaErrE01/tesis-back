import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Auth } from 'src/auth/decorators';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserToken } from 'src/auth/guards';

@Controller('cart')
@Auth()
export class CartController {
  constructor(private readonly cartService: CartService) { }

  // @Post()
  // create(@Body() createCartDto: CreateCartDto) {
  //   return this.cartService.create(createCartDto);
  // }

  @Get()
  findAll(@GetUser() user: UserToken) {
    return this.cartService.getUserCart(Number(user.id));
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  @Patch()
  update(@Body() updateCartDto: UpdateCartDto, @GetUser() user: UserToken) {
    return this.cartService.update(updateCartDto, Number(user.id));
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}
