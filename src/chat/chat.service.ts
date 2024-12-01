import { BadRequestException, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class ChatService {
  private readonly user: PrismaService['user_ce'];
  private readonly chatMessage: PrismaService['chat_users'];

  constructor(
    private readonly authService: AuthService,
    prisma: PrismaService,
  ) {
    this.user = prisma.user_ce;
    this.chatMessage = prisma.chat_users;
  }

  async createChat(emisorId: number, receptorId: number) {
    if (emisorId === receptorId) throw new BadRequestException('Emisor y receptor no pueden ser el mismo');

    const receptor = await this.authService.findById(receptorId);

    //existe el chat?
    const existChat = await this.chatMessage.findUnique({
      where: {
        emisor_id_receptor_id: {
          emisor_id: emisorId,
          receptor_id: receptor.id,
        }
      },
      include: { message_ce: true },
    });

    if (existChat) return existChat;

    const chatUser = await this.chatMessage.create({
      data: {
        emisor: { connect: { id: emisorId } },
        receptor: { connect: { id: receptor.id } },
      },
      include: { message_ce: true },
    });

    return chatUser;
  }

  async registerWebSocketClient(wsClient: Socket, userId: number) {
    const user = await this.authService.findById(userId);

    await this.user.update({
      where: { id: user.id },
      data: { isOnline: true },
    });

    wsClient.join(user.id.toString());

    // case 1: I am the emisor
    const usersFromChatMessage = await this.chatMessage.findMany({
      select: { receptor_id: true },
      where: {
        emisor_id: user.id,
        AND: [
          { receptor: { status: 'Activo' } }
        ]
      }
    });

    // case 2. I am the receptor
    const usersFromChatMessage2 = await this.chatMessage.findMany({
      select: { emisor_id: true },
      where: {
        receptor_id: user.id,
        AND: [
          { emisor: { status: 'Activo' } }
        ]
      }
    });

    const chatUserIds = new Set([usersFromChatMessage2.map(user => user.emisor_id), usersFromChatMessage.map(user => user.receptor_id)].flat());

    const chatUsers = await this.user.findMany({ where: { id: { in: Array.from(chatUserIds) } }, select: { id: true, name: true, lastName: true, phone: true, isOnline: true } });

    // emit to same user all users that I am chating
    wsClient.emit('load-chat-users', chatUsers);

    chatUsers.filter(chatUser => chatUser.isOnline).forEach(({ id }) => {
      wsClient.to(id.toString()).emit('conection', {
        userId: user.id,
        isOnline: true,
      });
    });
  }

  async unregisterWebSocketClient(wsClient: Socket, userId: number) {
    wsClient.leave(userId.toString());
    this.user.update({
      where: { id: userId, status: 'Activo' },
      data: { isOnline: false },
    });

    // emit to all users that I am chating that I am offline
    const usersFromChatMessage = await this.chatMessage.findMany({
      select: { receptor_id: true },
      where: {
        emisor_id: userId,
        AND: [
          {
            receptor: {
              isOnline: true,
              status: 'Activo',
            }
          }
        ]
      }
    });

    usersFromChatMessage.forEach(({ receptor_id }) => {
      wsClient.to(receptor_id.toString()).emit('conection', {
        userId: userId,
        isOnline: false,
      });
    });
  }

  async sendMessage({ from, to, message }: { from: number; to: number; message: string }) {
    const fromUser = await this.authService.findById(from);
    const toUser = await this.authService.findById(to);

    const chatUser = await this.chatMessage.findUnique({
      where: {
        emisor_id_receptor_id: {
          emisor_id: from,
          receptor_id: to,
        }
      },
      include: { message_ce: true },
    });

    if (!chatUser) throw new BadRequestException('No existe el chat');

  }

}
