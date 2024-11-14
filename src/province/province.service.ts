import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class ProvinceService {
  private readonly province: PrismaService['province_ce'];

  constructor(prismaService: PrismaService) {
    this.province = prismaService.province_ce;
  }

  create(createProvinceDto: CreateProvinceDto) {
    return 'This action adds a new province';
  }

  findAll() {
    return this.province.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
