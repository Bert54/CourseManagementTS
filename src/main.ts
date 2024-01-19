import { NestFactory } from '@nestjs/core';

import * as Config from 'config';

import { AppConfig } from './config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common';

async function bootstrap(config: AppConfig) {
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

  await app.listen(config.port);
}

bootstrap(Config.get<AppConfig>('server'));
