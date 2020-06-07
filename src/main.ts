import { NestFactory } from '@nestjs/core';
import { TelegramBot } from 'nest-telegram';
import { Configuration } from '@solid-soda/config';
import md5 from 'md5';

import { AppModule } from '&app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(Configuration);

  if (config.isProd()) {
    const secretPath = md5(config.getStringOrThrow('TELEGRAM_TOKEN'));
    const bot = app.get(TelegramBot);
    app.use(bot.getMiddleware(secretPath));
  }

  await app.listen(3001);
}

bootstrap();
