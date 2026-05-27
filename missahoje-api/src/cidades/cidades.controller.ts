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
import { ClearCacheInterceptor } from '../common/interceptors/clear-cache.interceptor';
import { CidadesService } from './cidades.service';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

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
  create(@Body() createCidadeDto: CreateCidadeDto) {
    return this.cidadesService.create(createCidadeDto);
  }

  @ApiOperation({ summary: 'Lista todas as cidades paginadas' })
  @Get()
  findAll(@Query() options: PaginationDto) {
    return this.cidadesService.findAll(options);
  }

  @ApiOperation({ summary: 'Busca uma cidade pelo ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cidadesService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualiza uma cidade' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateCidadeDto: UpdateCidadeDto) {
    return this.cidadesService.update(id, updateCidadeDto);
  }

  @ApiOperation({ summary: 'Remove uma cidade' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.cidadesService.remove(id);
  }
}
