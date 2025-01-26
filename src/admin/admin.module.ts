import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../auth/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'mogacomedy2001@17',
      // signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
