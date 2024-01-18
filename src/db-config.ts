import { SqlDatabaseConfig } from './config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const setupSqlDatabase = (
  config: SqlDatabaseConfig,
): TypeOrmModuleOptions => {
  return {
    // type: 'postgres',
    type: config.type as any,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    autoLoadEntities: true,
  };
};
