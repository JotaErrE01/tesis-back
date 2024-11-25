import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Get(':imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.fileService.getStaticProductImage(imageName);

    res.sendFile(path);
  }
}
