import { Injectable } from '@nestjs/common';
import { CreatePredefinedProductDto } from './dto/create-predefined-product.dto';
import { UpdatePredefinedProductDto } from './dto/update-predefined-product.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class PredefinedProductService {
  private readonly predefinedProduct: PrismaService['predefined_product'];

  constructor(prismaService: PrismaService) {
    this.predefinedProduct = prismaService.predefined_product;
  }

  create(createPredefinedProductDto: CreatePredefinedProductDto) {
    const { category_id, ...rest } = createPredefinedProductDto;
    return this.predefinedProduct.create({
      data: {
        ...rest,
        category: { connect: { id: category_id } },
      },
    });
  }

  findAll() {
    return this.predefinedProduct.findMany({ include: { category: true }, where: { AND: { category: { status: Status.Activo } } } });
  }

  findOne(id: number) {
    return this.getPredefinedProduct(id);
  }

  async update(id: number, updatePredefinedProductDto: UpdatePredefinedProductDto) {
    await this.getPredefinedProduct(id);
    return this.predefinedProduct.update({
      where: { id },
      data: updatePredefinedProductDto,
    });
  }

  async remove(id: number) {
    await this.getPredefinedProduct(id);
    return this.predefinedProduct.softDelete({
      where: { id },
    });
  }

  private getPredefinedProduct(id: number) {
    return this.predefinedProduct.findUnique({ where: { id } });
  }
}
