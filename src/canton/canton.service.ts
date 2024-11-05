import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class CantonService {
  private readonly canton: PrismaService['canton_ce'];

  constructor(prisma: PrismaService) {
    this.canton = prisma.canton_ce;
  }

  findAll() {
    return this.canton.findMany();
  }

  getCantonesByProvinceId(provinceId: number) {
    return this.canton.findMany({
      where: { provinceId }
    });
  }

  async findOne(id: number) {
    const canton = await this.canton.findUnique({
      where: { id }
    });

    if (!canton) throw new NotFoundException(`Cantón con id ${id} no encontrado`);

    return canton;
  }
}
