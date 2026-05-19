import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ParoquiaService } from './paroquia.service';
import { CreateParoquiaDto } from './dto/create-paroquia.dto';
import { UpdateParoquiaDto } from './dto/update-paroquia.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';

@Controller('paroquias')
export class ParoquiaController {
    constructor(private readonly paroquiaService: ParoquiaService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
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
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateParoquiaDto: UpdateParoquiaDto,
    ) {
        return this.paroquiaService.update(id, updateParoquiaDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.paroquiaService.remove(id);
    }
}
