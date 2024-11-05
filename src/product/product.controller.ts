import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { Role } from 'src/auth/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Auth(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() body: CreateProductDto,
    @UploadedFile() file: any
  ) {
    console.log(file);

    return body;
    // return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDTO
  ) {
    return this.productService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
