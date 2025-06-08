import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ensureUploadDirectories } from './shared/file-upload.utils';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Ensure upload directories exist
  ensureUploadDirectories();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Enable cookie parsing

  // Enable validation pipe for DTO processing
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();
