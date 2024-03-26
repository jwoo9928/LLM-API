import { GemmaService } from './gemma.service';
import { Request } from 'express';
export declare class GemmaController {
    private readonly gemmaService;
    constructor(gemmaService: GemmaService);
    getHello(request: Request): Promise<string>;
}
