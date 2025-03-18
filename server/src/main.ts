import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend requests
  app.enableCors({
    origin: 'http://localhost:3000', // Allow frontend
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(5000);
  console.log('🚀 Server running on http://localhost:5000');
}

bootstrap();
