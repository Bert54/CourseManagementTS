import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor() {
    super();
  }
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }
}
