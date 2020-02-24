/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/camelcase */
import 'dotenv/config';

import {
  Controller,
  Get,
  HttpException,
  Query,
  Request,
  Response,
} from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cookie from 'cookie';
import * as crypto from 'crypto';
import * as querystring from 'querystring';

// import { Repository } from 'typeorm';
import { Shop } from '../shop/shop.entity';
import { ShopService } from '../shop/shop.service';
@Controller()
export class InstallController {
  private readonly forwardingAddress = 'https://f8ff32b6.ngrok.io';

  private readonly apiKey = process.env.SHOPIFY_API_KEY;

  private readonly apiSecret = process.env.SHOPIFY_API_SECRET;

  private accessToken: string;

  private scopes = `read_products,
    write_script_tags,
    write_customers,
    write_themes`;

  constructor(private readonly shopService: ShopService) {
    return this;
  }

  // 安装应用
  @Get('/shopify')
  shopify(@Query() query, @Response() res): void {
    const { shop } = query;
    if (shop) {
      const state = new Date().getTime();
      const redirectUri = `${this.forwardingAddress}/shopify/callback`;
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${this.apiKey}&scope=${this.scopes}&state=${state}&redirect_uri=${redirectUri}`;
      res.cookie('state', state);
      res.redirect(installUrl);
    } else {
      throw new HttpException(
        'Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request',
        400,
      );
    }
  }

  @Get('/shopify/callback')
  async callback(@Query() query, @Request() req): Promise<Shop> {
    console.log('callback');
    const { shop, hmac, code, state } = query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
      throw new HttpException('Request origin cannot be verified', 403);
    }

    if (!shop || !hmac || !code) {
      throw new HttpException('Required parameters missing', 400);
    }

    const map = { ...req.query };
    delete map.signature;
    delete map.hmac;
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, 'utf-8');
    const generatedHash = Buffer.from(
      crypto
        .createHmac('sha256', this.apiSecret)
        .update(message)
        .digest('hex'),
      'utf-8',
    );
    let hashEquals = false;
    // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
      // timingSafeEqual will return an error if the input buffers are not the same length.
    } catch (e) {
      hashEquals = false;
    }

    if (!hashEquals) {
      throw new HttpException('HMAC validation failed', 400);
    }

    const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
    const accessTokenPayload = {
      client_id: this.apiKey,
      client_secret: this.apiSecret,
      code,
    };

    try {
      const getAccessToken = await axios({
        method: 'post',
        url: accessTokenRequestUrl,
        responseType: 'json',
        headers: {
          'content-type': 'application/json',
        },
        data: accessTokenPayload,
      });
      this.accessToken = getAccessToken.data.access_token;
    } catch (error) {
      throw new HttpException(error.response.data, 403);
    }

    const shopRequestUrl = `https://${shop}/admin/api/2020-01/shop.json`;
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': this.accessToken,
    };

    const shopInfo = await axios.get(shopRequestUrl, {
      headers: shopRequestHeaders,
    });

    const {
      id,
      email,
      domain,
      accessToken = this.accessToken,
      primaryDomain,
    } = shopInfo.data.shop;

    console.log({ id, email, domain, accessToken });

    return await this.shopService.addShop({
      id,
      email,
      domain,
      accessToken,
      primaryDomain,
    });
  }
}
