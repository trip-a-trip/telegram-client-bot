import { TelegramActionHandler } from 'nest-telegram';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WelcomeHandler {
  @TelegramActionHandler({ onStart: true })
  async start(ctx: any) {
    await ctx.reply('Hello!');
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: any) {
    await ctx.reply('Help me =)');
  }
}
