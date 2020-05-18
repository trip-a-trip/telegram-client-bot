import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule, TelegramBot } from 'nest-telegram';
import { ModuleRef } from '@nestjs/core';

import { ConfigModule } from './external/config.module';
import { typeOrmProvider } from './external/typeOrmProvider';
import { TelegramOptionsFactory } from './external/TelegramOptionsFactory';
import { WelcomeHandler } from './presentation/telegram/WelcomeHandler';
import { LocationHandler } from './presentation/telegram/LocationHandler';
import { Account } from './domain/Account.entity';
import { PlatformModule } from './platform/platform.module';
import { CurrentAccount } from './presentation/telegram/CurrentAccount';
import { StringTemplateEngine } from './presentation/template/StringTemplateEngine';
import { TemplateEngine } from './presentation/template/TemplateEngine';
import { CallbackData } from './domain/CallbackData.entity';
import { CallbackDataStore } from './application/CallbackDataStore';

@Module({
  imports: [
    ConfigModule,
    PlatformModule,
    TypeOrmModule.forRootAsync(typeOrmProvider),
    TypeOrmModule.forFeature([Account, CallbackData]),
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TelegramOptionsFactory,
    }),
  ],
  controllers: [],
  providers: [
    CurrentAccount,
    WelcomeHandler,
    LocationHandler,
    CallbackDataStore,
    { provide: TemplateEngine, useClass: StringTemplateEngine },
  ],
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
