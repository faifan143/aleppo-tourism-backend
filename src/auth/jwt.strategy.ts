import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.access_token, // Extract token from cookies
      ]),
      secretOrKey: 'mogacomedy2001@17', // Replace with environment variable in production
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email }; // Return validated payload
  }
}
