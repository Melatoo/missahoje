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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/usuario.entity';

@Controller('usuarios')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Post()
    create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }

    @Get()
    findAll(@Query('email') email?: string) {
        if (email) {
            return this.usuariosService.findByEmail(email);
        }

        return this.usuariosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuariosService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto,
    ) {
        return this.usuariosService.update(id, updateUsuarioDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usuariosService.remove(id);
    }
}
