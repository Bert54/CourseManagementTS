import { NestFactory } from '@nestjs/core';

import * as Config from 'config';

import { AppConfig } from './config';
import { AppModule } from './app.module';

async function bootstrap(config: AppConfig) {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
}

bootstrap(Config.get<AppConfig>('server'));
