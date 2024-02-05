import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

import { LoggerService } from '../modules/logger';

@Injectable()
export class ErrorLoggerInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap({
        error: (error) => {
          if (!(error instanceof HttpException)) {
            // not a http error, should always be logged as warn
            this.logger.warn(
              `An error occurred while performing the request [error: '${error.message}']`,
            );
          } else {
            const httpErr = error as HttpException;
            const message = `An error occurred while performing the request [status: ${httpErr.getStatus()} ; cause: '${httpErr.cause}']`;
            // log as warn if http error is in the 500 range, otherwise just log as info
            if (httpErr.getStatus() >= 500 && httpErr.getStatus() < 600) {
              this.logger.warn(message);
            } else {
              this.logger.log(message);
            }
          }
        },
      }),
    );
  }
}
