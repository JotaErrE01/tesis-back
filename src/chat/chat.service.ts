import { BadRequestException, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class ChatService {
  private readonly user: PrismaService['user_ce'];
  private readonly chatMessage: PrismaService['message_ce'];
  private readonly chatUser: PrismaService['chat_users'];

  constructor(
    private readonly authService: AuthService,
    prisma: PrismaService,
  ) {
    this.user = prisma.user_ce;
    this.chatUser = prisma.chat_users;
    this.chatMessage = prisma.message_ce;
  }

  async createChat(emisorId: number, receptorId: number) {
    if (emisorId === receptorId) throw new BadRequestException('Emisor y receptor no pueden ser el mismo');

    const receptor = await this.authService.findById(receptorId);

    //existe el chat?
    const existChat = await this.chatUser.findUnique({
      where: {
        emisor_id_receptor_id: {
          emisor_id: emisorId,
          receptor_id: receptor.id,
        }
      },
      include: { message_ce: true },
    });

    if (existChat) return existChat;

    const chatUser = await this.chatUser.create({
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
    console.log({ wsId: wsClient.id });
    await this.user.update({
      where: { id: user.id },
      data: { isOnline: true },
    });

    wsClient.join(user.id.toString());

    // case 1: I am the emisor
    const usersFromChatMessage = await this.chatUser.findMany({
      select: { receptor_id: true },
      where: {
        emisor_id: user.id,
        AND: [
          { receptor: { status: 'Activo' } }
        ]
      }
    });

    // case 2. I am the receptor
    const usersFromChatMessage2 = await this.chatUser.findMany({
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
    await this.user.update({
      where: { id: userId, status: 'Activo' },
      data: { isOnline: false },
    });

    // case 1: I am the emisor
    const usersFromChatMessage = await this.chatUser.findMany({
      select: { receptor_id: true },
      where: {
        emisor_id: userId,
        AND: [
          { receptor: { status: 'Activo' } }
        ]
      }
    });

    // case 2. I am the receptor
    const usersFromChatMessage2 = await this.chatUser.findMany({
      select: { emisor_id: true },
      where: {
        receptor_id: userId,
        AND: [
          { emisor: { status: 'Activo' } }
        ]
      }
    });

    const chatUserIds = new Set([usersFromChatMessage2.map(user => user.emisor_id), usersFromChatMessage.map(user => user.receptor_id)].flat());

    chatUserIds.forEach((chatUserId) => {
      wsClient.to(chatUserId.toString()).emit('conection', {
        userId,
        isOnline: false,
      });
    });
  }

  async getChatMessages(client: Socket, { emisorId, receptorId }: { emisorId: number; receptorId: number }) {
    console.log({ client: (client as any).id });

    const chatUser = await Promise.any([
      this.chatUser.findUniqueOrThrow({
        where: {
          emisor_id_receptor_id: {
            emisor_id: emisorId,
            receptor_id: receptorId,
          },
          status: Status.Activo,
        },
        include: { message_ce: { orderBy: { creation_date: 'desc' } } },
      }),
      this.chatUser.findUniqueOrThrow({
        where: {
          emisor_id_receptor_id: {
            emisor_id: receptorId,
            receptor_id: emisorId,
          },
          status: Status.Activo,
        },
        include: { message_ce: { orderBy: { creation_date: 'desc' } } },
      }),
    ]);

    if (!chatUser) throw new BadRequestException('No existe el chat');

    return chatUser.message_ce.map(message => ({
      id: message.id_message,
      isMe: Number(message.creation_user) === emisorId,
      message: message.text_message,
      createdAt: message.creation_date,
    }));
  }

  async sendMessage(client: Socket, { from, to, message }: { from: number; to: number; message: string }) {
    const fromUser = await this.authService.findById(from);
    const toUser = await this.authService.findById(to);

    const chatUser = await Promise.any([
      // 1.case: I am the emisor
      this.chatUser.findUniqueOrThrow({
        where: {
          emisor_id_receptor_id: {
            emisor_id: from,
            receptor_id: to,
          },
          status: Status.Activo,
        },
        include: { message_ce: true },
      }),

      // 2.case: I am the receptor
      this.chatUser.findUniqueOrThrow({
        where: {
          emisor_id_receptor_id: {
            emisor_id: to,
            receptor_id: from,
          },
          status: Status.Activo,
        },
        include: { message_ce: true },
      }),
    ]);

    if (!chatUser) throw new BadRequestException('No existe el chat');

    await this.chatMessage.create({
      data: {
        text_message: message,
        chat_users: {
          connect: {
            emisor_id_receptor_id: {
              emisor_id: chatUser.emisor_id,
              receptor_id: chatUser.receptor_id,
            }
          }
        },
        creation_date: new Date(),
        creation_user: fromUser.id,
      }
    });

    client.to(to.toString()).emit('personal-message', {
      from: fromUser.id,
      to: toUser.id,
      message: message,
      date: new Date(),
      // isRead: false,
    });

  }

}
