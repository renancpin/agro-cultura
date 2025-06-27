import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from '../interfaces/token-payload.interface';
import { LoggedUser } from '../types/logged-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', '3600s'),
    });
  }

  validate(payload: ITokenPayload): LoggedUser {
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}
