require('dotenv/config');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SnakeNamingStrategy } = require('typeorm-snake-naming-strategy');

const { DATABASE_URL, DATABASE_SSL } = process.env;

module.exports = {
  type: 'postgres',
  url: DATABASE_URL,
  timezone: 'Z',
  ...(DATABASE_SSL === 'true'
    ? {
        extra: {
          ssl: true,
        },
      }
    : {}),
  entities: ['dist/**/*.entity{.ts,.js}'],
  // 开启同步，自动创建数据表
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
