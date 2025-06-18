import { LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

class WinstonLogger implements LoggerService {
  constructor(private logger: Logger) {}

  private stringify(data: any): string {
    return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  }

  log(message: any, context?: string) {
    this.logger.info(this.stringify(message), { context });
  }
  error(message: any, _stack?: any, context?: string) {
    this.logger.error(this.stringify(message), { context });
  }
  warn(message: any, context?: string) {
    this.logger.warn(this.stringify(message), { context });
  }
  debug(message: any, context?: string): void {
    this.logger.debug(this.stringify(message), { context });
  }
  verbose(message: any, context?: string): void {
    this.logger.verbose(this.stringify(message), { context });
  }
  fatal(message: any, context?: string): void {
    this.logger.log('fatal', this.stringify(message), { context });
  }
}

export function setupWinstonLogger(): LoggerService {
  const devFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf(
      (info: {
        level: string;
        message: string;
        timestamp: string;
        context: string;
      }) => {
        const { level, message, timestamp, context } = info;

        return `${timestamp} - ${level}: [${context}] ${message}`;
      },
    ),
  );

  const prodFormat = format.combine(format.timestamp(), format.json());

  const logger = createLogger({
    transports: [
      new transports.Console({
        format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
      }),
    ],
  });

  return new WinstonLogger(logger);
}
