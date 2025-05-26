import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.SERVER_PORT) || 3000;
  app.enableCors();
  await app.listen(port);
  console.log(`Server is running on http://${process.env.HOST}:${port}`);
}
bootstrap();
