import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Auth } from 'src/auth/decorators';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserToken } from 'src/auth/guards';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  // @Post()
  // create(@Body() createCartDto: CreateCartDto) {
  //   return this.cartService.create(createCartDto);
  // }

  @Get()
  @Auth()
  findAll(@GetUser() user: UserToken) {
    return this.cartService.findAll(Number(user.id));
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  @Patch()
  @Auth()
  update(@Body() updateCartDto: UpdateCartDto, @GetUser() user: UserToken) {
    return this.cartService.update(updateCartDto, Number(user.id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
