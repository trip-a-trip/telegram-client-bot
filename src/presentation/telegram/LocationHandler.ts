import { Injectable } from '@nestjs/common';
import { TelegramActionHandler, Context, PipeContext } from 'nest-telegram';
import { EatClient, Coordinates } from '@trip-a-trip/lib';

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

  @TelegramActionHandler({ location: true })
  async location(
    ctx: Context,
    @PipeContext(CurrentAccount)
    account: Account,
  ) {
    if (!ctx.message || !ctx.message.location) {
      throw new Error('Okay');
    }

    const { location } = ctx.message;

    await this.replyWithVenue(ctx, account, location);
  }

  private async replyWithVenue(
    context: Context,
    account: Account,
    location: Coordinates,
  ) {
    const venue = await this.eat.findVenue(account.userId, location);

    if (!venue) {
      const content = await this.template.render(TemplateName.NotFound);
      context.replyWithMarkdown(content);
      return;
    }

    const content = await this.template.render(TemplateName.Venue, venue);
    context.replyWithMarkdown(content, { disable_web_page_preview: true });
    context.replyWithLocation(
      venue.coordinates.latitude,
      venue.coordinates.longitude,
    );
  }
}
