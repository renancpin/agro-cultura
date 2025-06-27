import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('Request');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.url.includes('health')) {
      return next.handle();
    }

    const startTime = Date.now();
    const requestId = Math.floor(Math.random() * Date.now()).toString(16);
    request['id'] = requestId;

    const requestBodyIsUnsafe: boolean =
      (typeof request.body === 'object' && 'password' in request.body) ||
      request.url.includes('auth') ||
      request.url.includes('user');

    this.logger.log({
      requestId,
      method: request.method,
      url: request.url,
      data: requestBodyIsUnsafe ? '[REDACTED]' : (request.body as object),
    });

    return next.handle().pipe(
      tap((response: Response) => {
        const responseTime = Date.now() - startTime;
        this.logger.log(
          {
            requestId,
            responseTime: `${responseTime}ms`,
            response: requestBodyIsUnsafe ? '[REDACTED]' : response,
          },
          'Response',
        );
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            {
              requestId,
              responseTime: `${responseTime}ms`,
              response: err.getResponse(),
            },
            null,
            'Response',
          );
        }

        throw err;
      }),
    );
  }
}
