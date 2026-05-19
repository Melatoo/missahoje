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
import { ComunidadesService } from './comunidades.service';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';

@Controller('comunidades')
export class ComunidadesController {
    constructor(private readonly comunidadesService: ComunidadesService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
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
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateComunidadeDto: UpdateComunidadeDto,
    ) {
        return this.comunidadesService.update(id, updateComunidadeDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.comunidadesService.remove(id);
    }
}
