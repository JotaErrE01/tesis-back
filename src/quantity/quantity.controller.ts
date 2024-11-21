import { Controller, Get } from '@nestjs/common';
import { QuantityService } from './quantity.service';

@Controller('quantity')
export class QuantityController {
  constructor(private readonly quantityService: QuantityService) { }
  @Get()
  findAll() {
    return this.quantityService.findAll();
  }
}
