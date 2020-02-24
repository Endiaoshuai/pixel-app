import { Injectable } from '@nestjs/common';

import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  private port: string;

  constructor(config: ConfigService) {
    this.port = config.get('PORT');
  }

  getHello(): string {
    return `Hello World! ${this.port}`;
  }
}
