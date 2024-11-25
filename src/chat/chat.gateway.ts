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
    @MessageBody() message: { sender: string; text: string },
    @ConnectedSocket() client: Socket,
  ): void {
    // Reenvía el mensaje a todos los clientes conectados
    this.server.emit('receiveMessage', message);
  }
}
