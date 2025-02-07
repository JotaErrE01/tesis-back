import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {


  constructor(
    private readonly seedService: SeedService,
  ) { }

  @Get()
  executeAllSeeds() {
    return this.seedService.executeAllSeeds();
  }

  @Get('users')
  executeUsersSeed() {
    return this.seedService.executeUsersSeed();
  }
}
