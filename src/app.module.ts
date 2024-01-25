import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { V1Module } from './v1';
import { LoggerModule } from './common';
import { ConfigSingleton, setupSqlDatabase, SqlDatabaseConfig } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      setupSqlDatabase(
        ConfigSingleton.getInstance().getConfig<SqlDatabaseConfig>(
          'sql-database',
        ),
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
