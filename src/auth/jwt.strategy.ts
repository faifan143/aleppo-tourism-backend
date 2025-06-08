import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Get token from Authorization header
      secretOrKey: 'mogacomedy2001@17', // Replace with environment variable in production
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // Return a consistent user object with id property
    return {
      id: payload.userId,
      email: payload.email
    };
  }
}
