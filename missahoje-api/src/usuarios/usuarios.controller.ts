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
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ClearCacheInterceptor } from '../common/interceptors/clear-cache.interceptor';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/usuario.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(CacheInterceptor, ClearCacheInterceptor)
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @ApiOperation({ summary: 'Cria um novo usuário' })
    @Post()
    create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }

    @ApiOperation({ summary: 'Lista todos os usuários paginados' })
    @Get()
    findAll(
        @Query() options: PaginationDto,
        @Query('email') email?: string,
    ) {
        if (email) {
            return this.usuariosService.findByEmail(email);
        }

        return this.usuariosService.findAll(options);
    }

    @ApiOperation({ summary: 'Busca um usuário pelo ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuariosService.findOne(id);
    }

    @ApiOperation({ summary: 'Atualiza um usuário' })
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto,
    ) {
        return this.usuariosService.update(id, updateUsuarioDto);
    }

    @ApiOperation({ summary: 'Remove um usuário' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usuariosService.remove(id);
    }
}
