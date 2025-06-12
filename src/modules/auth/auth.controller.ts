import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    if (!result) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    return result;
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
