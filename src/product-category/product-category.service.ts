import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class ProductCategoryService {
  private readonly productCategory: PrismaService['product_category'];

  constructor(prismaService: PrismaService) {
    this.productCategory = prismaService.product_category;
  }

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    return await this.productCategory.create({
      data: createProductCategoryDto,
    });
  }

  findAll() {
    return this.productCategory.findMany({ where: { status: Status.Activo } });
  }

  findOne(id: number) {
    return this.getProductCategory(id);
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    await this.getProductCategory(id);
    return this.productCategory.update({
      where: { id, status: Status.Activo },
      data: updateProductCategoryDto,
    });
  }

  async remove(id: number) {
    await this.getProductCategory(id);
    return this.productCategory.softDelete({ where: { id } });
  }

  private async getProductCategory(id: number) {
    const productCategory = await this.productCategory.findUnique({
      where: { id, status: Status.Activo },
    });

    if (!productCategory) throw new NotFoundException(`ProductCategory with id ${id} not found`);

    return productCategory;
  }
}
