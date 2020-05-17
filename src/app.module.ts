import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule, TelegramBot } from 'nest-telegram';
import { Configuration } from '@solid-soda/config';
import { ModuleRef } from '@nestjs/core';

import { ConfigModule } from './external/config.module';
import { typeOrmProvider } from './external/typeOrmProvider';
import { TelegramOptionsFactory } from './external/TelegramOptionsFactory';
import { WelcomeHandler } from './presentation/telegram/WelcomeHandler';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmProvider),
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TelegramOptionsFactory,
    }),
  ],
  controllers: [],
  providers: [WelcomeHandler],
})
export class AppModule implements NestModule {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly telegramBot: TelegramBot,
  ) {}

  onModuleInit() {
    this.telegramBot.init(this.moduleRef);
  }

  configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
