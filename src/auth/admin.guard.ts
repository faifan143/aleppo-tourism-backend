import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const admin = request.cookies['access_token'];
    return !!admin;
  }
}
