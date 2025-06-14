import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/openapi')
  home(): void {}

  @Get('health')
  healthcheck(): boolean {
    return this.appService.healthCheck();
  }
}
