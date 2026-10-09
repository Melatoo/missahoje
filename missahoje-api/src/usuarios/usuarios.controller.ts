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
import { Pagination } from 'nestjs-typeorm-paginate';
import { ClearCacheInterceptor } from '../common/interceptors/clear-cache.interceptor';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';
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
    create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<UsuarioDto> {
        return this.usuariosService.create(createUsuarioDto);
    }

    @ApiOperation({ summary: 'Lista todos os usuários paginados' })
    @ApiPaginatedResponse(UsuarioDto)
    @Get()
    findAll(
        @Query() options: PaginationDto,
        @Query('email') email?: string,
    ): Promise<Pagination<UsuarioDto>> {
        return this.usuariosService.findAll(options, email);
    }

    @ApiOperation({ summary: 'Busca um usuário pelo ID' })
    @Get(':id')
    findOne(@Param('id') id: string): Promise<UsuarioDto> {
        return this.usuariosService.findOne(id);
    }

    @ApiOperation({ summary: 'Atualiza um usuário' })
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto,
    ): Promise<UsuarioDto> {
        return this.usuariosService.update(id, updateUsuarioDto);
    }

    @ApiOperation({ summary: 'Remove um usuário' })
    @Delete(':id')
    remove(@Param('id') id: string): Promise<UsuarioDto> {
        return this.usuariosService.remove(id);
    }
}
