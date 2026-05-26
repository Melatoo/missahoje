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

@Controller('missas')
@UseInterceptors(CacheInterceptor, ClearCacheInterceptor)
export class MissasController {
    constructor(private readonly missasService: MissasService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createMissaDto: CreateMissaDto) {
        return this.missasService.create(createMissaDto);
    }

    @Get()
    findAll(
        @Query(new ValidationPipe({ transform: true })) query: GetMissasDto,
    ) {
        return this.missasService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.missasService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateMissaDto: UpdateMissaDto) {
        return this.missasService.update(id, updateMissaDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.missasService.remove(id);
    }
}
