import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitOfMesureDto } from './dto/create-unit-of-mesure.dto';
import { UpdateUnitOfMesureDto } from './dto/update-unit-of-mesure.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class UnitOfMesureService {
  private readonly unitOfMesure: PrismaService['unit_of_measure'];

  constructor(prismaService: PrismaService) {
    this.unitOfMesure = prismaService.unit_of_measure;
  }

  async create(createUnitOfMesureDto: CreateUnitOfMesureDto) {
    return this.unitOfMesure.create({ data: createUnitOfMesureDto });
  }

  findAll() {
    return this.unitOfMesure.findMany({ where: { status: Status.Activo } });
  }

  findOne(id: number) {
    return this.getUnitOfMesure(id);
  }

  async update(id: number, updateUnitOfMesureDto: UpdateUnitOfMesureDto) {
    const oldUnitOfMesure = await this.getUnitOfMesure(id);

    return await this.unitOfMesure.update({
      where: { id: oldUnitOfMesure.id },
      data: updateUnitOfMesureDto,
    });
  }

  async remove(id: number) {
    await this.getUnitOfMesure(id);
    return this.unitOfMesure.softDelete({ where: { id } });
  }

  private async getUnitOfMesure(id: number) {
    const unitOfMesure = await this.unitOfMesure.findUnique({
      where: { id, status: Status.Activo },
    });

    if (!unitOfMesure) throw new NotFoundException(`UnitOfMesure with id ${id} not found`);

    return unitOfMesure;
  }
}
