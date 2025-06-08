import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaService } from 'src/auth/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ReviewController],
    providers: [ReviewService, PrismaService],
    exports: [ReviewService],
})
export class ReviewModule { } 