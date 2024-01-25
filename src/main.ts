import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppConfig, ConfigSingleton as Config } from './config';
import { AppModule } from './app.module';
import { LoggerService } from './common/modules/logger';

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

  const config = Config.getInstance().getConfig<AppConfig>('server');

  await app.listen(config.port);
}

bootstrap();
