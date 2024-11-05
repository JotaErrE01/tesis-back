import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class ProductService {
  private readonly product: PrismaService['product'];

  constructor(prismaService: PrismaService) {
    this.product = prismaService.product;
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: {
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        // image: createProductDto.image,
        status: createProductDto.status,
        unitOfMeasure: { connect: { id: createProductDto.unitOfMeasure } },
        predefinedProduct: { connect: { id: createProductDto.predefinedProduct } },
        user_ce: { connect: { id: createProductDto.user } },
      }
    });
  }

  async findAll(paginationDto: PaginationDTO) {
    const { page = 1, size = 10 } = paginationDto;

    const products = await this.product.findMany({
      skip: (page - 1) * size,
      take: size,
      include: {
        predefinedProduct: {
          include: { category: true }
        },
        unitOfMeasure: true,
        user_ce: {
          select: { name: true, email: true }
        },
      },
      orderBy: { creation_date: 'desc' },
    });

    const totalProducts = await this.product.count();

    const totalPages = Math.ceil(totalProducts / size);
    const hasMore = page < totalPages;


    return {
      totalPages,
      hasMore,
      currentPage: page,
      products,
    };
  }

  findOne(id: number) {
    return this.getProduct(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private async getProduct(id: number) {
    const product = await this.product.findUnique({
      where: { id },
      include: {
        predefinedProduct: {
          include: { category: true }
        },
        unitOfMeasure: true,
        user_ce: {
          select: { name: true, email: true }
        },
      }
    });

    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }
}
