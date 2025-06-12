import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome de usuário não pode ser vazio' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Senha precisa ter pelo menos 6 caracteres' })
  password: string;
}
