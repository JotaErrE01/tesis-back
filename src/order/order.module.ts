import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from 'src/cart/cart.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [CartModule],
})
export class OrderModule { }
