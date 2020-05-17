import { Injectable } from '@nestjs/common';
import { TelegramActionHandler, Context } from 'nest-telegram';

@Injectable()
export class LocationHandler {
  @TelegramActionHandler({ location: true })
  async location(ctx: Context) {
    console.log(ctx.message?.location);
    ctx.reply('Thanks');
    ctx.replyWithLocation(0.1, 0.1);
  }
}
