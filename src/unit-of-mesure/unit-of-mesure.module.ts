import { Module } from '@nestjs/common';
import { UnitOfMesureService } from './unit-of-mesure.service';
import { UnitOfMesureController } from './unit-of-mesure.controller';

@Module({
  controllers: [UnitOfMesureController],
  providers: [UnitOfMesureService],
})
export class UnitOfMesureModule {}
