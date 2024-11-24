import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { UserToken } from 'src/auth/guards';
import { Status } from '@prisma/client';

@Injectable()
export class CommentService {
  private readonly comment: PrismaService['comment_ce'];

  constructor(prismaService: PrismaService) {
    this.comment = prismaService.comment_ce;
  }

  create(user: UserToken, createCommentDto: CreateCommentDto) {
    return this.comment.create({
      data: {
        comentario: createCommentDto.comentario,
        rating: createCommentDto.rating,
        creation_user: user.name,
        creation_date: new Date(),
        user_ce: { connect: { id: user.id } },
        product: { connect: { id: createCommentDto.product_id } },
      }
    });
  }

  findAll(productId: number) {
    return this.comment.findMany({ where: { product_id: productId, status: Status.Activo }, include: { user_ce: { select: { name: true, lastName: true } } }, orderBy: { creation_date: 'desc' } });
  }

  // async findOne(id: number) {
  //   const comment = await this.comment.findUnique({ where: { id_comment: id } });
  //   if (!comment) throw new NotFoundException(`Comentario con id ${id} no encontrado`);
  //   return comment;
  // }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  remove(id: number) {
    return this.comment.delete({ where: { id_comment: id } });
  }
}
