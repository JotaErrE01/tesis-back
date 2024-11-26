import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  // Maneja nuevas conexiones
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  // Maneja desconexiones
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Escucha mensajes del cliente
  @SubscribeMessage('sendMessage')
  handleMessage(
    client: Socket, payload: { sender: string; text: string },
    // @MessageBody() message: { sender: string; text: string },
    // @ConnectedSocket() client: Socket,
  ): void {
    console.log(payload);

    // Reenvía el mensaje a todos los clientes conectados
    this.server.emit('receiveMessage', payload);

    // Envia el mensaje al cliente que envió el mensaje
    client.emit('receiveMessage', payload);

    // Envia el mensaje al cliente con el id especificado en el payload
    this.server.to(payload.sender).emit('receiveMessage', payload);

    // enviar a todos menos al cliente que envió el mensaje
    this.server.except(client.id).emit('receiveMessage', payload);

    // enviar a todos menos al cliente que envió el mensaje
    client.broadcast.emit('receiveMessage', payload);
  }
}
