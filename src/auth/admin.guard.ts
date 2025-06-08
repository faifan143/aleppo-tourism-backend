import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    // Check for cookie-based authentication
    const cookieToken = request.cookies['access_token'];

    // Check for token in Authorization header
    const authHeader = request.headers.authorization;
    const headerToken = authHeader ? authHeader.split(' ')[1] : null;

    // Use either token
    const token = cookieToken || headerToken;

    if (!token) {
      return false;
    }

    try {
      // Verify the token
      const decoded = this.jwtService.verify(token);
      // Add the admin to the request object
      request['admin'] = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
