import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shop } from '../shop/shop.entity';
import { ShopModule } from '../shop/shop.module';
import { InstallController } from './install.controller';
import { InstallService } from './install.service';
@Module({
  imports: [TypeOrmModule.forFeature([Shop]), ShopModule],
  providers: [InstallService],
  controllers: [InstallController],
})
export class InstallModule {}
