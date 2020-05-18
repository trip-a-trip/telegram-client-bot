import { Injectable } from '@nestjs/common';
import { TelegramActionHandler, Context, PipeContext } from 'nest-telegram';
import {} from 'lodash';
import { EatClient, Venue, Coordinates } from '@trip-a-trip/lib';

import { sleep } from '&app/utils/sleep';
import { Account } from '&app/domain/Account.entity';
import { CallbackDataStore } from '&app/application/CallbackDataStore';

import { CurrentAccount } from './CurrentAccount';
import { TemplateEngine } from '../template/TemplateEngine';
import { TemplateName } from '../template/TemplateName';
import { MoreCallbackData } from './MoreCallbackData';

@Injectable()
export class LocationHandler {
  constructor(
    private readonly eat: EatClient,
    private readonly template: TemplateEngine,
    private readonly store: CallbackDataStore<MoreCallbackData>,
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
    await ctx.replyWithChatAction('typing');

    const { location } = ctx.message;

    const venue = await this.eat.findVenue(account.userId, location);

    if (!venue) {
      const content = await this.template.render(TemplateName.NotFound);
      await ctx.replyWithMarkdown(content);
      return;
    }

    await this.replyWithVenue(ctx, venue, location);
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
    await ctx.replyWithChatAction('typing');

    const {
      data: { location, ids },
    } = await this.store.get(ctx.callbackQuery.data);

    const venue = await this.eat.findVenue(account.userId, location, {
      skipIds: ids,
    });

    if (!venue) {
      const content = await this.template.render(TemplateName.NoMore);
      await ctx.replyWithMarkdown(content);
      return;
    }

    await this.replyWithVenue(ctx, venue, location, ids);
  }

  private async replyWithVenue(
    context: Context,
    venue: Venue,
    location: Coordinates,
    recentIds: string[] = [],
  ) {
    const moreData = {
      location,
      ids: [venue.id, ...recentIds],
    };

    const [content, dataId] = await Promise.all([
      this.template.render(TemplateName.Venue, venue),
      this.store.save(moreData),
    ]);

    await context.replyWithMarkdown(content, {
      disable_web_page_preview: true,
    });

    await context.replyWithChatAction('find_location');
    await sleep(400);

    await context.replyWithLocation(
      venue.coordinates.latitude,
      venue.coordinates.longitude,
      {
        reply_markup: {
          inline_keyboard: [[{ text: 'Ещё', callback_data: dataId }]],
        },
      },
    );
  }
}
