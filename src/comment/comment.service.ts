import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class CommentService {
  private readonly comment: PrismaService['comment_ce'];

  constructor(prismaService: PrismaService) {
    this.comment = prismaService.comment_ce;
  }

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return this.comment.findMany();
  }

  async findOne(id: number) {
    const comment = await this.comment.findUnique({ where: { id_comment: id } });
    if (!comment) throw new NotFoundException(`Comentario con id ${id} no encontrado`);
    return comment;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
