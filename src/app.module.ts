import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

import {
  ConfigSingleton as Config,
  setupSqlDatabase,
  SqlDatabaseConfig,
} from './config';
import { V1Module } from './v1/v1.module';
import { LoggerModule } from './common/modules/logger';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      setupSqlDatabase(
        Config.getInstance().getConfig<SqlDatabaseConfig>('sql-database'),
      ),
    ),
    LoggerModule,
    V1Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
