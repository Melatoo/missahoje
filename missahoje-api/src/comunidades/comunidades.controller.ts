import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
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
import { ComunidadesService } from './comunidades.service';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';
import { ComunidadeDto } from './dto/comunidade.dto';
import { ComunidadeDetalheDto } from './dto/comunidade-detalhe.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Comunidades')
@Controller('comunidades')
@UseInterceptors(CacheInterceptor, ClearCacheInterceptor)
export class ComunidadesController {
    constructor(private readonly comunidadesService: ComunidadesService) {}

    @ApiOperation({ summary: 'Cria uma nova comunidade' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(
        @Body() createComunidadeDto: CreateComunidadeDto,
    ): Promise<ComunidadeDto> {
        return this.comunidadesService.create(createComunidadeDto);
    }

    @ApiOperation({ summary: 'Lista todas as comunidades paginadas' })
    @ApiPaginatedResponse(ComunidadeDetalheDto)
    @Get()
    findAll(
        @Query() options: PaginationDto,
        @Query('cidadeId') cidadeId?: string,
        @Query('nome') nome?: string,
    ): Promise<Pagination<ComunidadeDetalheDto>> {
        return this.comunidadesService.findAll(options, cidadeId, nome);
    }

    @ApiOperation({ summary: 'Busca uma comunidade pelo ID' })
    @Get(':id')
    findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ComunidadeDetalheDto> {
        return this.comunidadesService.findOne(id);
    }

    @ApiOperation({ summary: 'Atualiza uma comunidade' })
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateComunidadeDto: UpdateComunidadeDto,
    ): Promise<ComunidadeDto> {
        return this.comunidadesService.update(id, updateComunidadeDto);
    }

    @ApiOperation({ summary: 'Remove uma comunidade' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<ComunidadeDto> {
        return this.comunidadesService.remove(id);
    }
}
