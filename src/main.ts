import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Enable cookie parsing
  app.enableCors({
    origin: '*',
  });

  await app.listen(8000);
}
bootstrap();
