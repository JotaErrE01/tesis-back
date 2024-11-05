import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UnitOfMesureService } from './unit-of-mesure.service';
import { CreateUnitOfMesureDto } from './dto/create-unit-of-mesure.dto';
import { UpdateUnitOfMesureDto } from './dto/update-unit-of-mesure.dto';

@Controller('unit-of-mesures')
export class UnitOfMesureController {
  constructor(private readonly unitOfMesureService: UnitOfMesureService) { }

  @Post()
  create(@Body() createUnitOfMesureDto: CreateUnitOfMesureDto) {
    return this.unitOfMesureService.create(createUnitOfMesureDto);
  }

  @Get()
  findAll() {
    return this.unitOfMesureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitOfMesureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUnitOfMesureDto: UpdateUnitOfMesureDto) {
    return this.unitOfMesureService.update(id, updateUnitOfMesureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitOfMesureService.remove(+id);
  }
}
