import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { MissasService } from './missas.service';
import { GetMissasDto } from './dto/get-missas.dto';
import { CreateMissaDto } from './dto/create-missa.dto';
import { UpdateMissaDto } from './dto/update-missa.dto';

@Controller('missas')
export class MissasController {
    constructor(private readonly missasService: MissasService) {}

    @Post()
    create(@Body() createMissaDto: CreateMissaDto) {
        return this.missasService.create(createMissaDto);
    }

    @Get()
    findAll(
        @Query(new ValidationPipe({ transform: true })) query: GetMissasDto,
    ) {
        return this.missasService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.missasService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateMissaDto: UpdateMissaDto) {
        return this.missasService.update(id, updateMissaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.missasService.remove(id);
    }
}
