import { PartialType } from '@nestjs/mapped-types';
import { CreateMissaDto } from './create-missa.dto';

export class UpdateMissaDto extends PartialType(CreateMissaDto) {}
