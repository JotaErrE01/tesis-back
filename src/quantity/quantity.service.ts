import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class QuantityService {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async findAll() {

    const [
      productQuantity,
      predefinedProductQuantity,
      productCategoryQuantity,
      unitOfMeasureQuantity,
      usersQuantity,
    ] = await Promise.all([
      this.prismaService.product.count({ where: { status: Status.Activo } }),
      this.prismaService.predefined_product.count({ where: { status: Status.Activo } }),
      this.prismaService.product_category.count({ where: { status: Status.Activo } }),
      this.prismaService.unit_of_measure.count({ where: { status: Status.Activo } }),
      this.prismaService.user_ce.count({ where: { status: Status.Activo } }),
    ]);

    return {
      productQuantity,
      predefinedProductQuantity,
      productCategoryQuantity,
      unitOfMeasureQuantity,
      usersQuantity,
    };
  }
}
