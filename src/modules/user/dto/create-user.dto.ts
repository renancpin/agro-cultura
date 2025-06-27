import { IsOptional, MinLength } from 'class-validator';
import { SejaNaoVazio } from 'src/shared/validators/validadores.decorator';
import { Roles } from '../enums/roles.enum';

export class CreateUserDto {
  @SejaNaoVazio()
  name: string;

  @SejaNaoVazio()
  username: string;

  @SejaNaoVazio()
  @MinLength(6, { message: 'Senha precisa ter pelo menos 6 caracteres' })
  password: string;

  @IsOptional()
  role: Roles = Roles.USER;
}
