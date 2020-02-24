/* eslint-disable no-return-await */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { Repository } from 'typeorm';

import { ShopInput } from './dtos/shop-input.dto';
import { Shop } from './shop.entity';
@Injectable()
export class ShopService {
  private apiVersion = '2020-01';

  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
  ) {
    return this;
  }

  public async addShop(input: ShopInput): Promise<Shop> {
    const shop = await this.shopRepository.findOne(input.id);
    if (shop) {
      shop.email = input.email;
      shop.primaryDomain = input.primaryDomain;
      shop.accessToken = input.accessToken;
      return await shop.save();
    }
    const addShop = await this.shopRepository.save(input);
    return addShop;
  }

  public async getShop(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne(id);
    return shop;
  }

  private getAxios(shop: Shop) {
    const axios = Axios.create({
      timeout: 10000,
      baseURL: `https://${shop.domain}/admin/api/${this.apiVersion}`,
      headers: {
        'X-Shopify-Access-Token': shop.accessToken,
      },
    });

    axios.interceptors.response.use(
      response => response,
      async err => {
        if (err.response) {
          throw new HttpException(err.response.data, err.response.status);
        }
      },
    );
    return axios;
  }

  public async getThemes(shopId: string) {
    const shop = await this.getShop(shopId);
    const axios = this.getAxios(shop);
    return (await axios.get(`/themes.json`)).data.themes;
  }

  public async getThemeAsset(shopId: string, themeId: string, key: string) {
    const shop = await this.getShop(shopId);
    const axios = this.getAxios(shop);
    if (key) {
      const {
        data: {
          asset: { value },
        },
      } = await axios.get(`/themes/${themeId}/assets.json`, {
        params: {
          'asset[key]': key,
        },
      });

      return value;
    }
    const { data } = await axios.get(`/themes/${themeId}/assets.json`);

    return data;
  }

  public async createOrUpdateThemeAsset(
    shopId: string,
    themeId: string,
    key: string,
    value: string,
  ) {
    const shop = await this.getShop(shopId);
    const axios = this.getAxios(shop);
    return (
      await axios.put(`/themes/${themeId}/assets.json`, {
        asset: { key, value },
      })
    ).data;
  }
}
