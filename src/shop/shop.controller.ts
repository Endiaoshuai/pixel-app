import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';

import { ShopService } from './shop.service';
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {
    return this;
  }

  @Get('/:shopId/themes')
  async themes(@Param() param) {
    return await this.shopService.getThemes(param.shopId);
  }

  @Get('/:shopId/theme/:themeId/assets')
  async assets(@Param() param, @Query() query) {
    console.log(param.shopId, param.themeId, query.key);
    return await this.shopService.getThemeAsset(
      param.shopId,
      param.themeId,
      query.key,
    );
  }

  @Put('/:shopId/theme/:themeId/asset')
  async createOrUpdateThemeAsset(@Param() param, @Body() body) {
    return await this.shopService.createOrUpdateThemeAsset(
      param.shopId,
      param.themeId,
      body.key,
      body.value,
    );
  }
}
