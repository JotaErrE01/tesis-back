import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: []
})
export class RoleModule { }
