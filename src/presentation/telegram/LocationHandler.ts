import { Injectable } from '@nestjs/common';
import { TelegramActionHandler, Context, PipeContext } from 'nest-telegram';
import { EatClient, Venue } from '@trip-a-trip/lib';

import { Account } from '&app/domain/Account.entity';

import { CurrentAccount } from './CurrentAccount';
import { TemplateEngine } from '../template/TemplateEngine';
import { TemplateName } from '../template/TemplateName';

@Injectable()
export class LocationHandler {
  constructor(
    private readonly eat: EatClient,
    private readonly template: TemplateEngine,
  ) {}

  @TelegramActionHandler({ on: ['location'] })
  async location(
    ctx: Context,
    @PipeContext(CurrentAccount)
    account: Account,
  ) {
    if (!ctx.message || !ctx.message.location) {
      throw new Error('Okay');
    }

    const { location } = ctx.message;

    const venue = await this.eat.findVenue(account.userId, location);

    if (!venue) {
      const content = await this.template.render(TemplateName.NotFound);
      await ctx.replyWithMarkdown(content);
      return;
    }

    await this.replyWithVenue(ctx, venue);
  }

  @TelegramActionHandler({ on: ['callback_query'] })
  async more(
    ctx: Context,
    @PipeContext(CurrentAccount)
    account: Account,
  ) {
    if (!ctx.callbackQuery || !ctx.callbackQuery.data) {
      throw new Error('Okay');
    }

    const data = JSON.parse(ctx.callbackQuery.data);

    const venue = await this.eat.findVenue(account.userId, data, {
      skipIds: data.ids,
    });

    if (!venue) {
      const content = await this.template.render(TemplateName.NoMore);
      await ctx.replyWithMarkdown(content);
      return;
    }

    await this.replyWithVenue(ctx, venue, data.ids);
  }

  private async replyWithVenue(
    context: Context,
    venue: Venue,
    recentIds: string[] = [],
  ) {
    const content = await this.template.render(TemplateName.Venue, venue);
    const moreData = JSON.stringify({
      ...venue.coordinates,
      ids: [venue.id, ...recentIds],
    });

    await context.replyWithMarkdown(content, {
      disable_web_page_preview: true,
    });
    await context.replyWithLocation(
      venue.coordinates.latitude,
      venue.coordinates.longitude,
      {
        reply_markup: {
          // TODO: callback to database, here only id
          inline_keyboard: [[{ text: 'Ещё', callback_data: moreData }]],
        },
      },
    );
  }
}
