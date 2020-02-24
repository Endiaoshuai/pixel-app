import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shop } from '../shop/shop.entity';
import { ShopService } from '../shop/shop.service';
import { CreatePixelInput } from './dtos/create-pixel-input.dto';
import { UpdatePixelInput } from './dtos/update-pixel-input.dto';
import { Pixel } from './pixel.entity';

@Injectable()
export class PixelService {
  constructor(
    @InjectRepository(Pixel)
    private readonly pixelRepository: Repository<Pixel>,
    private readonly shopService: ShopService,
  ) {
    return this;
  }

  public async createPixel(
    input: CreatePixelInput,
    shopId: string,
  ): Promise<Pixel> {
    console.log('create');
    const shop = await this.shopService.getShop(shopId);
    const result = await this.pixelRepository.save({ ...input, shop });
    return result;
  }

  public async pixel(id: number): Promise<Pixel> {
    const result = await this.pixelRepository.findOne(id);
    return result;
  }

  public async updatePixel(
    input: UpdatePixelInput,
    id: number,
  ): Promise<Pixel> {
    const pixel = await this.pixelRepository.findOne(id);
    pixel.collection = input.collection;
    pixel.pixel = input.pixel;
    const result = await pixel.save();
    return result;
  }

  public async removePixel(id: number): Promise<Pixel> {
    const pixel = await this.pixelRepository.findOne(id);
    await pixel.remove();
    pixel.id = id;
    return pixel;
  }

  public async pixels(shopId: string): Promise<Pixel[]> {
    const pixels = await this.pixelRepository.find({
      where: {
        shop: { id: shopId },
      },
      order: {
        createAt: 'DESC',
      },
    });
    return pixels;
  }
}
