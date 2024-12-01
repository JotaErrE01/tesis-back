import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { Role } from 'src/auth/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Auth(Role.Admin, Role.Vendedor)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10, message: 'File is too big' }),
          new FileTypeValidator({ fileType: /^(image\/(jpeg|jpg|png|webp))$/ }),
        ],
      })
    ) file?: Express.Multer.File | undefined
  ) {
    return this.productService.create(createProductDto, user, file);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDTO
  ) {
    return this.productService.findAll(paginationDto);
  }

  @Get('seller/:id')
  @Auth(Role.Admin, Role.Vendedor)
  findAllBySeller(
    @GetUser() user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>
  ) {
    return this.productService.findAllProductsByUser(Number(user.id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @Auth(Role.Admin, Role.Vendedor)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10, message: 'File is too big' }),
          new FileTypeValidator({ fileType: /^(image\/(jpeg|jpg|png|webp))$/ }),
        ],
      })
    ) file?: Express.Multer.File | undefined
  ) {
    return this.productService.update(+id, updateProductDto, user, file);
  }

  @Delete(':id')
  @Auth(Role.Admin, Role.Vendedor)
  remove(@Param('id') id: string, @GetUser() user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>) {
    return this.productService.remove(+id, user);
  }
}
