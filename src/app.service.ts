import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): boolean {
    return true;
  }
}
