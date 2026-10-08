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
import { ParoquiaService } from './paroquia.service';
import { CreateParoquiaDto } from './dto/create-paroquia.dto';
import { UpdateParoquiaDto } from './dto/update-paroquia.dto';
import { ParoquiaDto } from './dto/paroquia.dto';
import { ParoquiaComComunidadesDto } from './dto/paroquia-com-comunidades.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Paróquias')
@Controller('paroquias')
@UseInterceptors(CacheInterceptor, ClearCacheInterceptor)
export class ParoquiaController {
    constructor(private readonly paroquiaService: ParoquiaService) {}

    @ApiOperation({ summary: 'Cria uma nova paróquia' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createParoquiaDto: CreateParoquiaDto): Promise<ParoquiaDto> {
        return this.paroquiaService.create(createParoquiaDto);
    }

    @ApiOperation({ summary: 'Lista todas as paróquias paginadas' })
    @ApiPaginatedResponse(ParoquiaComComunidadesDto)
    @Get()
    findAll(
        @Query() options: PaginationDto,
        @Query('cidadeId') cidadeId?: string,
        @Query('nome') nome?: string,
    ): Promise<Pagination<ParoquiaComComunidadesDto>> {
        return this.paroquiaService.findAll(options, cidadeId, nome);
    }

    @ApiOperation({ summary: 'Busca uma paróquia pelo ID' })
    @Get(':id')
    findOne(@Param('id') id: string): Promise<ParoquiaComComunidadesDto> {
        return this.paroquiaService.findOne(id);
    }

    @ApiOperation({ summary: 'Atualiza uma paróquia' })
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateParoquiaDto: UpdateParoquiaDto,
    ): Promise<ParoquiaDto> {
        return this.paroquiaService.update(id, updateParoquiaDto);
    }

    @ApiOperation({ summary: 'Remove uma paróquia' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string): Promise<ParoquiaDto> {
        return this.paroquiaService.remove(id);
    }
}
