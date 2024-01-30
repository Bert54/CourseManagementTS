import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SqlDatabaseConfig } from './interfaces';
import process from 'process';

export const setupSqlDatabase = (
  config: SqlDatabaseConfig,
): TypeOrmModuleOptions => {
  return {
    type: config.type as any,
    host: config.host,
    port: config.port,
    username: config.username,
    password: !!process.env.DATABASE_PASSWORD
      ? process.env.DATABASE_PASSWORD
      : config.password,
    database: config.database,
    autoLoadEntities: true,
  };
};
