import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @ApiOperation({
    summary: 'Documentação',
    description: 'Redireciona para /openapi',
  })
  @Get()
  @Redirect('/openapi')
  home(): void {}
}
