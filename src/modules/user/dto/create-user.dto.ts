import { MinLength } from 'class-validator';
import { SejaNaoVazio } from 'src/shared/validators/validadores.decorator';

export class CreateUserDto {
  @SejaNaoVazio()
  name: string;

  @SejaNaoVazio()
  username: string;

  @SejaNaoVazio()
  @MinLength(6, { message: 'Senha precisa ter pelo menos 6 caracteres' })
  password: string;
}
