import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TelegramModule, TelegramBot } from 'nest-telegram';
import { MODERATION_NOTIFY_QUEUE } from '@trip-a-trip/lib';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
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
import { CurrentCollaborator } from './presentation/telegram/CurrentCollaborator';
import { MixinCustomKeyboard } from './presentation/telegram/MixinCustomKeyboard';
import { CollaborationHandler } from './presentation/telegram/CollaborationHandler';
import { TelegramErrorCatcher } from './presentation/telegram/TelegramErrorCatcher';
import { bullProvider } from './external/bullProvider';
import { ModerationNotifyProcessor } from './presentation/queue/ModerationNotifyProcessor';

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
    BullModule.registerQueueAsync(bullProvider(MODERATION_NOTIFY_QUEUE)),
  ],
  controllers: [],
  providers: [
    CurrentAccount,
    CurrentCollaborator,
    TelegramErrorCatcher,
    MixinCustomKeyboard,
    WelcomeHandler,
    LocationHandler,
    CallbackDataStore,
    CollaborationHandler,
    ModerationNotifyProcessor,
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
