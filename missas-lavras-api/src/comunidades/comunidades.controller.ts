import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ComunidadesService } from "./comunidades.service";
import { CreateComunidadeDto } from "./dto/create-paroquias.dto";
import { UpdateComunidadeDto } from "./dto/update-comunidades.dto";

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
    findAll() {
        return this.comunidadesService.findAll();
    }

    @Get(':nome')
    findByName(@Param('nome') nome: string) {
        return this.comunidadesService.findByName(nome);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateComunidadeDto: UpdateComunidadeDto) {
        return this.comunidadesService.update(id, updateComunidadeDto);
    }
}