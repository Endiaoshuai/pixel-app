import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShopModule } from '../shop/shop.module';
import { Pixel } from './pixel.entity';
import { PixelResolver } from './pixel.resolver';
import { PixelService } from './pixel.service';
@Module({
  imports: [TypeOrmModule.forFeature([Pixel]), ShopModule],

  controllers: [],
  providers: [PixelService, PixelResolver],
})
export class PixelModule {}
