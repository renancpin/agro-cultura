import { PartialType } from '@nestjs/swagger';
import { CreateProdutorDto } from './create-produtor.dto';

export class UpdateProdutorDto extends PartialType(CreateProdutorDto) {}
