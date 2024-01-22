import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as Config from 'config';

import { V1Module } from './v1';
import { setupSqlDatabase, SqlDatabaseConfig } from './config';
import { LoggerModule } from './common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      setupSqlDatabase(Config.get<SqlDatabaseConfig>('sql-database')),
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
