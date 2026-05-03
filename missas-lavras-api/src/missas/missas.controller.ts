import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { MissasService } from './missas.service';
import { GetMissasDto } from './dto/get-missas.dto';

@Controller('missas')
export class MissasController {
    constructor(private readonly missasService: MissasService) {}

    @Get()
    findAll(
        @Query(new ValidationPipe({ transform: true })) query: GetMissasDto,
    ) {
        return this.missasService.findAll(query);
    }
}
