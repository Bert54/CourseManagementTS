import process from 'process';
import * as yaml from 'js-yaml';
import fs from 'fs';

const defaultPath = 'config/default.yml';

export class ConfigSingleton {
  private static instance: ConfigSingleton = new ConfigSingleton();

  private readonly config: Record<string, any>;

  private constructor() {
    const path: string = !!process.env.CONFIG_FILE_PATH
      ? process.env.CONFIG_FILE_PATH
      : defaultPath;
    this.config = yaml.load(fs.readFileSync(path, 'utf8')) as Record<
      string,
      any
    >;
  }

  public static getInstance(): ConfigSingleton {
    return this.instance;
  }

  getConfig<T>(key: string): T {
    if (!this.config[key]) {
      throw new Error(`Configuration key '${key} was not found'`);
    }
    return this.config[key] as T;
  }
}
