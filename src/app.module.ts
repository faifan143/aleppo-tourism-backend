import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TourismPlacesModule } from './tourism-places/tourism-places.module';
import { PrismaService } from './auth/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CloudinaryService } from './shared/cloudinary.service';

@Module({
  imports: [
    AdminModule,
    TourismPlacesModule,
    JwtModule.register({ secret: 'mogacomedy2001@17' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CloudinaryService],
  exports: [CloudinaryService],
})
export class AppModule {}
