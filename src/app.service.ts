import { Injectable } from '@nestjs/common';

import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  private jwtSecret: string;

  constructor(config: ConfigService) {
    this.jwtSecret = config.get('JWT_SECRET');
  }

  getHello(): string {
    return `Hello World! ${this.jwtSecret}`;
  }
}
