import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SqlDatabaseConfig } from './interfaces';

export const setupSqlDatabase = (
  config: SqlDatabaseConfig,
): TypeOrmModuleOptions => {
  return {
    type: config.type as any,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    autoLoadEntities: true,
  };
};
