import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { ID } from 'type-graphql';

import { Shop } from '../shop/shop.entity';
import { ShopService } from '../shop/shop.service';
import { CreatePixelInput } from './dtos/create-pixel-input.dto';
import { UpdatePixelInput } from './dtos/update-pixel-input.dto';
import { Pixel } from './pixel.entity';
import { PixelService } from './pixel.service';

@Resolver(() => Pixel)
export class PixelResolver {
  constructor(
    private readonly pixelService: PixelService,
    private readonly shopService: ShopService,
  ) {
    return this;
  }

  @Mutation(() => Pixel)
  public async createPixel(
    @Args('input') input: CreatePixelInput,
    @Args('shopId') shopId: string,
  ): Promise<Pixel> {
    const result = await this.pixelService.createPixel(input, shopId);
    return result;
  }

  @Mutation(() => Pixel)
  public async updatePixel(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args('input') input: UpdatePixelInput,
  ): Promise<Pixel> {
    const result = await this.pixelService.updatePixel(input, id);
    return result;
  }

  @Mutation(() => Pixel)
  public async removePixel(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<Pixel> {
    const result = await this.pixelService.removePixel(id);
    return result;
  }

  @Query(() => Pixel)
  public async pixel(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<Pixel> {
    const result = await this.pixelService.pixel(id);
    return result;
  }

  @Query(() => [Pixel])
  public async pixels(
    @Args({ name: 'shopId', type: () => ID }) shopId: string,
  ): Promise<Pixel[]> {
    const result = await this.pixelService.pixels(shopId);
    return result;
  }

  @ResolveProperty()
  public async shop(@Parent() pixel: Pixel): Promise<Shop> {
    const data = await this.shopService.getShop(pixel.shopId);
    return data;
  }
}
