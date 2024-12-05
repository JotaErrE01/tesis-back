import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class OrderService {
  private readonly order_ce: PrismaService['order_ce'];
  private readonly order_detail: PrismaService['order_detail'];

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.order_ce = this.prismaService.order_ce;
    this.order_detail = this.prismaService.order_detail;
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll(userId: number) {
    return this.order_ce.findMany({
      where: {
        user_ce: { id: userId, status: Status.Activo },
        status: Status.Activo
      },
      include: {
        user_ce: { select: { name: true, lastName: true } },
      },
      orderBy: { creation_date: 'desc' },
    });
  }

  async getOderDetailByOrderId(id: number) {
    const order = await this.getOrderById(id);
    return this.order_detail.findMany({
      where: { order_ce: { id_order: order.id_order } },
      include: {
        product: {
          where: {
            status: Status.Activo,
            predefinedProduct: {
              status: Status.Activo,
              category: { status: Status.Activo }
            },
          },
          include: {
            predefinedProduct: {
              include: { category: true }
            }
          }
        },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private async getOrderById(id: number) {
    const order = await this.order_ce.findUnique({ where: { id_order: id } });
    if (!order) throw new NotFoundException(`No se encontró el pedido con id ${id}`);
    return order;
  }
}
