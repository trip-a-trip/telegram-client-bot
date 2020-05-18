import {
  TelegramModuleOptionsFactory,
  TelegramModuleOptions,
} from 'nest-telegram';
import { Injectable } from '@nestjs/common';
import { Configuration } from '@solid-soda/config';

@Injectable()
export class TelegramOptionsFactory implements TelegramModuleOptionsFactory {
  constructor(private readonly config: Configuration) {}

  createOptions(): TelegramModuleOptions {
    return {
      token: this.config.getStringOrThrow('TELEGRAM_TOKEN'),
      sitePublicUrl: this.config.getStringOrThrow('PUBLIC_URL'),
      usePolling: this.config.isDev(),
    };
  }
}
