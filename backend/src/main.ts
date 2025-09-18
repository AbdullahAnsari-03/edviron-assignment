import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
   origin: [
  'http://localhost:5173',
  'https://edviron-assignment-lemon.vercel.app',
],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true 
  }));

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();