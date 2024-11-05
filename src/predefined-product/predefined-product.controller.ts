import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PredefinedProductService } from './predefined-product.service';
import { CreatePredefinedProductDto } from './dto/create-predefined-product.dto';
import { UpdatePredefinedProductDto } from './dto/update-predefined-product.dto';

@Controller('predefined-product')
export class PredefinedProductController {
  constructor(private readonly predefinedProductService: PredefinedProductService) {}

  @Post()
  create(@Body() createPredefinedProductDto: CreatePredefinedProductDto) {
    return this.predefinedProductService.create(createPredefinedProductDto);
  }

  @Get()
  findAll() {
    return this.predefinedProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.predefinedProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePredefinedProductDto: UpdatePredefinedProductDto) {
    return this.predefinedProductService.update(+id, updatePredefinedProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.predefinedProductService.remove(+id);
  }
}
