import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  private logger = new Logger('Health');

  @Get()
  @HealthCheck()
  check() {
    const checks = [() => this.db.pingCheck('database')];
    const checksWithLogs = checks.map((check) => async () => {
      const result = await check();
      this.logger.log(result);
      return result;
    });
    return this.health.check(checksWithLogs);
  }
}
