import { NestFactory } from '@nestjs/core';

import * as Config from 'config';

import { AppModule } from './app.module';
import { AppConfig } from './config';

async function bootstrap(config: AppConfig) {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
}

bootstrap(Config.get<AppConfig>('server'));
