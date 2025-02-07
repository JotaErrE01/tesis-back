import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    executeAllSeeds(): string;
    executeUsersSeed(): Promise<string>;
}
