import { Configuration } from '@solid-soda/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

import { ConfigModule } from './config.module';

export const typeOrmProvider: TypeOrmModuleAsyncOptions = {
  useFactory: (config: Configuration) => {
    return {
      type: 'postgres',
      host: config.getStringOrThrow('DB_HOST'),
      port: config.getNumberOrThrow('DB_PORT'),
      username: config.getStringOrThrow('DB_USER'),
      password: config.getStringOrThrow('DB_PASSWORD'),
      database: config.getStringOrThrow('DB_NAME'),
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
      synchronize: false,
      ssl: config.isProd()
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : undefined,
    };
  },
  inject: [Configuration],
  imports: [ConfigModule],
};
