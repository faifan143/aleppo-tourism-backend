import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from './prisma.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'mogacomedy2001@17', // Replace with environment variable in production
            signOptions: { expiresIn: '7d' },
        }),
    ],
    providers: [JwtStrategy, PrismaService],
    exports: [PassportModule, JwtModule],
})
export class AuthModule { } 