import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ParoquiaService } from "./paroquia.service";
import { CreateParoquiaDto } from "./dto/create-paroquias.dto";
import { UpdateParoquiaDto } from "./dto/update-paroquias.dto";

@Controller('paroquias')
export class ParoquiaController {
    constructor(private readonly paroquiaService: ParoquiaService) { }

    @Post()
    create(@Body() createParoquiaDto: CreateParoquiaDto) {
        return this.paroquiaService.create(createParoquiaDto);
    }

    @Get()
    findAll() {
        return this.paroquiaService.findAll();
    }

    @Get(':nome')
    findByName(@Param('nome') nome: string) {
        return this.paroquiaService.findByName(nome);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateParoquiaDto: UpdateParoquiaDto) {
        return this.paroquiaService.update(id, updateParoquiaDto);
    }
}