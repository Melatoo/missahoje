import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ParoquiaService } from "./paroquia.service";
import { CreateParoquiaDto } from "./dto/create-paroquia.dto";
import { UpdateParoquiaDto } from "./dto/update-paroquia.dto";

@Controller('paroquias')
export class ParoquiaController {
    constructor(private readonly paroquiaService: ParoquiaService) { }

    @Post()
    create(@Body() createParoquiaDto: CreateParoquiaDto) {
        return this.paroquiaService.create(createParoquiaDto);
    }

    @Get()
    findAll(@Query('nome') nome?: string) {
        return this.paroquiaService.findAll(nome);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.paroquiaService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateParoquiaDto: UpdateParoquiaDto) {
        return this.paroquiaService.update(id, updateParoquiaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.paroquiaService.remove(id);
    }
}