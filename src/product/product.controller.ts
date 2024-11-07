import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { Role } from 'src/auth/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { fileNamer, fileFilter } from 'src/common/helpers';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Auth(Role.Admin)
  @UseInterceptors(FileInterceptor('file', {
    // fileFilter: console.log
    // fileFilter(req, file, callback) {
    //   return fileFilter({ req, file, callback });
    // },
    // storage: diskStorage({
    //   destination: './static/products',
    //   filename: fileNamer,
    // })
  }))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      })
    ) file: Express.Multer.File
  ) {
    console.log(file.size, file);

    // multer({
    //   storage: diskStorage({
    //     destination: './static/products',
    //     filename: fileNamer,
    //   })
    // });

    return createProductDto;
    return this.productService.create(createProductDto, file);
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
