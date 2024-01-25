import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppConfig, ConfigSingleton } from './config';
import { AppModule } from './app.module';
import { LoggerService } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = ConfigSingleton.getInstance().getConfig<AppConfig>('server');

  await app.listen(config.port);
}

bootstrap();
