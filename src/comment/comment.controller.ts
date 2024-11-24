import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Auth } from 'src/auth/decorators';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserToken } from 'src/auth/guards';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @Auth()
  create(@GetUser() user: UserToken, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(user, createCommentDto);
  }

  @Get()
  @Auth()
  findAll(@Query('productId') productId: number) {
    return this.commentService.findAll(productId);
  }

  // @Get(':id')
  // @Auth()
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(+id);
  // }

  // @Patch(':id')
  // @Auth()
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentService.update(+id, updateCommentDto);
  // }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
