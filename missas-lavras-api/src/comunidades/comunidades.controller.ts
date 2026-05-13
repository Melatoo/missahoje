import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ComunidadesService } from "./comunidades.service";
import { CreateComunidadeDto } from "./dto/create-comunidade.dto";
import { UpdateComunidadeDto } from "./dto/update-comunidade.dto";

@Controller('comunidades')
export class ComunidadesController {
    constructor(
        private readonly comunidadesService: ComunidadesService,
    ) { }

    @Post()
    create(@Body() createComunidadeDto: CreateComunidadeDto) {
        return this.comunidadesService.create(createComunidadeDto);
    }

    @Get()
    findAll(@Query('nome') nome?: string) {
        return this.comunidadesService.findAll(nome);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.comunidadesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateComunidadeDto: UpdateComunidadeDto) {
        return this.comunidadesService.update(id, updateComunidadeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.comunidadesService.remove(id);
    }
}