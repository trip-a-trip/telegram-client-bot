import { TelegramActionHandler, Context } from 'nest-telegram';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WelcomeHandler {
  @TelegramActionHandler({ onStart: true })
  async start(ctx: Context) {
    await ctx.reply('Hello!');
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    await ctx.reply('Help me =)');
  }
}
