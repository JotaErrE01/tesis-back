import { IsNumber, IsPositive } from 'class-validator';


export class CreateChatDto {

  @IsNumber()
  @IsPositive()
  emisorId: number;
}

