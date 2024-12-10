import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { UserToken } from 'src/auth/guards';

@Injectable()
export class RequestsService {
  private readonly user_requests: PrismaService['user_requests'];

  constructor(
    prismaService: PrismaService,
  ) {
    this.user_requests = prismaService.user_requests;
  }

  async create(user: UserToken, createRequestDto: CreateRequestDto) {
    return this.user_requests.create({
      data: {
        title: createRequestDto.title,
        description: createRequestDto.description,
        image: createRequestDto.image,
        user_id: user.id,
        creation_date: new Date(),
      },
    });
  }

  findAll() {
    return `This action returns all requests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
