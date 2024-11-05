import { Module } from '@nestjs/common';
import { PredefinedProductService } from './predefined-product.service';
import { PredefinedProductController } from './predefined-product.controller';

@Module({
  controllers: [PredefinedProductController],
  providers: [PredefinedProductService],
})
export class PredefinedProductModule {}
