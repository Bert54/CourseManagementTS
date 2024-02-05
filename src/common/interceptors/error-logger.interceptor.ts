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
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap({
        error: (error) => {
          if (!(error instanceof HttpException)) {
            this.logger.log(
              `An error occurred while performing the request [error: '${error.message}']`,
            );
          } else {
            const httpErr = error as HttpException;
            this.logger.log(
              `An error occurred while performing the request [status: ${httpErr.getStatus()} ; cause: '${httpErr.cause}']`,
            );
          }
        },
      }),
    );
  }
}
