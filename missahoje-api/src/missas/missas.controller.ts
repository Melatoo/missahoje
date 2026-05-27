import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    ValidationPipe,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ClearCacheInterceptor } from '../common/interceptors/clear-cache.interceptor';
import { MissasService } from './missas.service';
import { GetMissasDto } from './dto/get-missas.dto';
import { CreateMissaDto } from './dto/create-missa.dto';
import { UpdateMissaDto } from './dto/update-missa.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';

@ApiTags('Missas')
@Controller('missas')
@UseInterceptors(CacheInterceptor, ClearCacheInterceptor)
export class MissasController {
    constructor(private readonly missasService: MissasService) {}

    @ApiOperation({ summary: 'Cria uma nova missa' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createMissaDto: CreateMissaDto) {
        return this.missasService.create(createMissaDto);
    }

    @ApiOperation({ summary: 'Lista todas as missas paginadas' })
    @Get()
    findAll(
        @Query(new ValidationPipe({ transform: true })) query: GetMissasDto,
    ) {
        return this.missasService.findAll(query);
    }

    @ApiOperation({ summary: 'Busca uma missa pelo ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.missasService.findOne(id);
    }

    @ApiOperation({ summary: 'Atualiza uma missa' })
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateMissaDto: UpdateMissaDto) {
        return this.missasService.update(id, updateMissaDto);
    }

    @ApiOperation({ summary: 'Remove uma missa' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.missasService.remove(id);
    }
}
