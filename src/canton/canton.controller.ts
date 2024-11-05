import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CantonService } from './canton.service';

@Controller('cantones')
export class CantonController {
  constructor(private readonly cantonService: CantonService) { }

  @Get()
  findAll() {
    return this.cantonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cantonService.findOne(id);
  }

  @Get('/byProvince/:provinceId')
  getCantonesByProvinceId(
    @Param('provinceId', ParseIntPipe) provinceId: number
  ) {
    return this.cantonService.getCantonesByProvinceId(provinceId);
  }
}
