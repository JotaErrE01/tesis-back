import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Auth } from 'src/auth/decorators';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Prisma } from '@prisma/client';
import { CreateChatDto } from './dtos/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) { }

  @Post('create-chat')
  @Auth()
  createChat(
    @ConnectedSocket() client: Socket,
    @GetUser() user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>,
    @Body() body: CreateChatDto,
  ) {
    console.log({ client: client.id });
    return this.chatService.createChat(Number(user.id), body.emisorId);
  }

  @Get('messages/:receptorId')
  @Auth()
  sendMessage(
    @ConnectedSocket() client: Socket,
    @GetUser() user: Prisma.user_ceGetPayload<{ include: { user_role: true } }>,
    @Param('receptorId', ParseIntPipe) receptorId: number,
  ) {
    return this.chatService.getChatMessages(client, { emisorId: Number(user.id), receptorId });
  }
}
