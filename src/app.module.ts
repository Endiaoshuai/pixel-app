import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { InstallModule } from './install/install.module';
import { PixelModule } from './pixel/pixel.module';
import { ShopModule } from './shop/shop.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule,
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      tracing: true,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    ShopModule,
    InstallModule,
    PixelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
