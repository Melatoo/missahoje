import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ClearCacheInterceptor } from '../common/interceptors/clear-cache.interceptor';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { CidadesService } from './cidades.service';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { GetCidadeProximaDto } from './dto/get-cidade-proxima.dto';
import { GetCidadesDto } from './dto/get-cidades.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';
import { CidadeDto } from './dto/cidade.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';

@ApiTags('Cidades')
@Controller('cidades')
@UseInterceptors(CacheInterceptor, ClearCacheInterceptor)
export class CidadesController {
    constructor(private readonly cidadesService: CidadesService) {}

    @ApiOperation({ summary: 'Cria uma nova cidade' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createCidadeDto: CreateCidadeDto): Promise<CidadeDto> {
        return this.cidadesService.create(createCidadeDto);
    }

    @ApiOperation({
        summary: 'Lista as cidades paginadas, com busca opcional por nome',
    })
    @ApiPaginatedResponse(CidadeDto)
    @Get()
    findAll(@Query() query: GetCidadesDto): Promise<Pagination<CidadeDto>> {
        return this.cidadesService.findAll(query);
    }

    @ApiOperation({
        summary: 'Busca a cidade atendida mais próxima de uma posição',
    })
    @Get('proxima')
    findNearest(@Query() position: GetCidadeProximaDto): Promise<CidadeDto> {
        return this.cidadesService.findNearest(position);
    }

    @ApiOperation({ summary: 'Busca uma cidade pelo ID' })
    @Get(':id')
    findOne(@Param('id') id: string): Promise<CidadeDto> {
        return this.cidadesService.findOne(id);
    }

    @ApiOperation({ summary: 'Atualiza uma cidade' })
    @ApiBearerAuth()
    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateCidadeDto: UpdateCidadeDto,
    ): Promise<CidadeDto> {
        return this.cidadesService.update(id, updateCidadeDto);
    }

    @ApiOperation({ summary: 'Remove uma cidade' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string): Promise<CidadeDto> {
        return this.cidadesService.remove(id);
    }
}
