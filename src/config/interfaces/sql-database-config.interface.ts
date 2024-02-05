export interface SqlDatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  database: string;
}
