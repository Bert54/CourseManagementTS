import { Module } from '@nestjs/common';
import { V1Module } from './v1';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlDatabaseConfig } from './config';
import * as Config from 'config';
import { setupSqlDatabase } from './db-config';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      setupSqlDatabase(Config.get<SqlDatabaseConfig>('sql-database')),
    ),
    V1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
