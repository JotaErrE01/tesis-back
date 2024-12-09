import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { Auth } from 'src/auth/decorators';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserToken } from 'src/auth/guards';
import { ApprovePaymentOrderDto } from './dto/approve-payment-order.dto';

@Controller()
@Auth()
export class OrderController {
  constructor(private readonly paymentService: OrderService) { }

  @Post('/payment')
  createPaymentOrder(@GetUser() user: UserToken, @Body() body: CreatePaymentOrderDto) {
    return this.paymentService.createPaymentOrder(user, body.paypalClientId);
  }

  @Post('/payment/approve')
  approvePaymentOrder(@GetUser() user: UserToken, @Body() body: ApprovePaymentOrderDto) {
    return this.paymentService.approvePaymentOrder(user, body.paypalClientId, body.transactionId);
  }

  @Get('/orders')
  findAllUserOrders(@GetUser() user: UserToken) {
    return this.paymentService.findAllUserOrders(Number(user.id));
  }

  @Get('/orders/details/:orderId')
  findOne(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getOderDetailByOrderId(orderId);
  }

  @Get('/orders/sales')
  findAllUserSales(@GetUser() user: UserToken) {
    return this.paymentService.findAllUserSales(Number(user.id));
  }

  @Delete('/payment/:transactionId')
  remove(@Param('transactionId') transactionId: string) {
    return this.paymentService.removeOrder(transactionId);
  }
}
