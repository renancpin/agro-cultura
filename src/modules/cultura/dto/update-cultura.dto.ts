import { PartialType } from '@nestjs/swagger';
import { CreateCulturaDto } from './create-cultura.dto';

export class UpdateCulturaDto extends PartialType(CreateCulturaDto) {}
