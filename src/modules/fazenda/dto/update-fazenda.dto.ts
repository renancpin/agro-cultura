import { PartialType } from '@nestjs/swagger';
import { CreateFazendaDto } from './create-fazenda.dto';

export class UpdateFazendaDto extends PartialType(CreateFazendaDto) {}
