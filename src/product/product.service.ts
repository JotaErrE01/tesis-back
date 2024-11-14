import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { join } from 'path';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  private readonly product: PrismaService['product'];

  constructor(prismaService: PrismaService) {
    this.product = prismaService.product;
  }

  create(createProductDto: CreateProductDto, user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>, file?: Express.Multer.File | undefined) {
    let fileName = null;
    if (file) {
      const directoryPath = join(__dirname, '..', '..', 'static', 'products');
      if (!existsSync(directoryPath)) mkdirSync(directoryPath, { recursive: true }); // recursively create directory for creaet two the firs static and the second products

      const getUuid = crypto.randomUUID.bind(crypto);
      const fileExtension = file.mimetype.split('/')[1];
      fileName = `${getUuid()}.${fileExtension}`;
      // save file to disk
      const filePath = join(directoryPath, fileName);
      writeFileSync(filePath, file.buffer); // Save file manually after validation
    }

    return this.product.create({
      data: {
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        image: fileName,
        creation_user: user.name,
        modification_user: user.name,
        unitOfMeasure: { connect: { id: createProductDto.unitOfMeasure } },
        predefinedProduct: { connect: { id: createProductDto.predefinedProduct } },
        user_ce: { connect: { id: user.id } },
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

  async update(id: number, updateProductDto: UpdateProductDto, user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>, file?: Express.Multer.File | undefined) {
    const oldProduct = await this.getProduct(id);
    let fileName = null;
    if (file) {
      const directoryPath = join(__dirname, '..', '..', 'static', 'products');
      if (!existsSync(directoryPath)) mkdirSync(directoryPath, { recursive: true }); // recursively create directory for creaet two the firs static and the second products

      // remove old image
      if (oldProduct.image) {
        const oldFilePath = join(directoryPath, oldProduct.image);
        unlinkSync(oldFilePath);
      }

      const getUuid = crypto.randomUUID.bind(crypto);
      const fileExtension = file.mimetype.split('/')[1];
      fileName = `${getUuid()}.${fileExtension}`;
      // save file to disk
      const filePath = join(directoryPath, fileName);
      writeFileSync(filePath, file.buffer); // Save file manually after validation
    }

    return this.product.update({
      where: { id },
      data: {
        description: updateProductDto.description,
        price: updateProductDto.price,
        stock: updateProductDto.stock,
        image: file ? fileName : oldProduct.image,
        status: updateProductDto.status,
        creation_user: user.name,
        modification_user: user.name,
        unitOfMeasure: { connect: { id: updateProductDto.unitOfMeasure } },
        predefinedProduct: { connect: { id: updateProductDto.predefinedProduct } },
        user_ce: { connect: { id: user.id } },
      }
    });
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
