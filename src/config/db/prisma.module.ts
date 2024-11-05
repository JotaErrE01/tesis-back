import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//? NOTA: En NestJS, el decorador @Global() se utiliza para marcar un módulo como global. Un módulo global se registra una vez y está disponible en toda la aplicación sin necesidad de importarlo explícitamente en cada módulo donde se necesita. 
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }
