import { Module } from '@nestjs/common';
import { PixelService } from './pixel.service';
import { PixelController } from './pixel.controller';

@Module({
  providers: [PixelService],
  controllers: [PixelController]
})
export class PixelModule {}
