import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3006);
  
  const logger = new CustomLogger();
  logger.log('Server is running on port 3006');
  logger.log('Available routes:');
  logger.log('  GET  /produtores');
  logger.log('  POST /produtores');
  logger.log('  PUT  /produtores/:id');
  logger.log('  DEL  /produtores/:id');
  logger.log('  GET  /dashboard');
}
bootstrap();
