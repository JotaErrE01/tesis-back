import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) { }

  // Maneja nuevas conexiones
  handleConnection(client: Socket) {
    const token = <string>client.handshake.query.token;
    try {
      const payload: { id: number } = this.jwtService.verify(token);
      this.chatService.registerWebSocketClient(client, payload.id);
    } catch (error) {
      console.log(error);
      console.log('No se pudo validar el token');
      client.disconnect(true);
      return;
    }
  }

  // Maneja desconexiones
  handleDisconnect(client: Socket) {
    const token = <string>client.handshake.query.token;
    const payload: { id: number } = this.jwtService.verify(token);
    this.chatService.unregisterWebSocketClient(client, payload.id);
  }

  // Escucha mensajes del cliente
  @SubscribeMessage('personal-message')
  handleMessage(
    client: Socket, payload: { from: number; to: number; message: string },
    // @MessageBody() message: { sender: string; text: string },
    // @ConnectedSocket() client: Socket,
  ): void {
    this.chatService.sendMessage(client, payload);
    // Reenvía el mensaje a todos los clientes conectados
    // this.server.emit('receiveMessage', payload);

    // // Envia el mensaje al cliente que envió el mensaje
    // client.emit('receiveMessage', payload);

    // // Envia el mensaje al cliente con el id especificado en el payload
    // this.server.to(payload.sender).emit('receiveMessage', payload);

    // // enviar a todos menos al cliente que envió el mensaje
    // this.server.except(client.id).emit('receiveMessage', payload);

    // // enviar a todos menos al cliente que envió el mensaje
    // client.broadcast.emit('receiveMessage', payload);
  }
}
