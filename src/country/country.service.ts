import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class CountryService {
  private readonly country: PrismaService['pais_ce'];

  constructor(private prismaService: PrismaService) {
    this.country = prismaService.pais_ce;
  }

  create(createCountryDto: CreateCountryDto) {
    return 'This action adds a new country';
  }

  findAll() {
    return this.country.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}
