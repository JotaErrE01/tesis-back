import { Injectable } from '@nestjs/common';
import { CreatePredefinedProductDto } from './dto/create-predefined-product.dto';
import { UpdatePredefinedProductDto } from './dto/update-predefined-product.dto';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class PredefinedProductService {
  private readonly predefinedProduct: PrismaService['predefined_product'];

  constructor(prismaService: PrismaService) {
    this.predefinedProduct = prismaService.predefined_product;
  }

  create(createPredefinedProductDto: CreatePredefinedProductDto) {
    const { categoryId, ...rest } = createPredefinedProductDto;
    return this.predefinedProduct.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
      },
    });
  }

  findAll() {
    return this.predefinedProduct.findMany();
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
    return this.predefinedProduct.delete({
      where: { id },
    });
  }

  private getPredefinedProduct(id: number) {
    return this.predefinedProduct.findUnique({ where: { id } });
  }
}
