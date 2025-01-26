import { Module } from '@nestjs/common';
import { TourismPlacesService } from './tourism-places.service';
import { TourismPlacesController } from './tourism-places.controller';
import { PrismaService } from 'src/auth/prisma.service';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Module({
  controllers: [TourismPlacesController],
  providers: [TourismPlacesService, PrismaService, CloudinaryService],
})
export class TourismPlacesModule {}
