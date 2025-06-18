import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResult } from './dto/login-result.dto';
import { ITokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto): Promise<LoginResult | null> {
    const user = await this.userService.findByUsername(loginData.username);
    const isAuthorized =
      user && (await bcrypt.compare(loginData.password, user.password));

    if (!isAuthorized) {
      return null;
    }

    const payload: ITokenPayload = {
      sub: user.id,
      username: user.username,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }

  async register(userData: RegisterDto) {
    const user = await this.userService.create(userData);

    return user;
  }
}
