import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from 'src/auth/prisma.service';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({ secret: 'mogacomedy2001@17' }),
    ],
    controllers: [EventController],
    providers: [EventService, PrismaService, CloudinaryService],
    exports: [EventService],
})
export class EventModule { } 