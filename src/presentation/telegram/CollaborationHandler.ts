import { TelegramActionHandler, Context, PipeContext } from 'nest-telegram';
import { CollaborationClient } from '@trip-a-trip/lib';
import { Injectable } from '@nestjs/common';

import { Account } from '&app/domain/Account.entity';

import { INVITE_MESSAGE, ADD_VENUE_MESSAGE } from './constants';
import { TemplateEngine } from '../template/TemplateEngine';
import { TemplateName } from '../template/TemplateName';
import {
  MixinCustomKeyboard,
  CreateKustomKeyboard,
} from './MixinCustomKeyboard';
import { CurrentAccount } from './CurrentAccount';

@Injectable()
export class CollaborationHandler {
  constructor(
    private readonly collaboration: CollaborationClient,
    private readonly template: TemplateEngine,
  ) {}

  @TelegramActionHandler({ message: new RegExp('INVITE_(.*)') })
  async handleInviteUsage(
    ctx: Context,
    @PipeContext(CurrentAccount) profile: Account,
    @PipeContext(MixinCustomKeyboard)
    createCustomKeyboard: CreateKustomKeyboard,
  ) {
    if (!ctx.message) {
      throw new Error('Sorry');
    }

    await this.collaboration.applyInvite(profile.userId, ctx.message.text!);

    const message = await this.template.render(TemplateName.Invited);

    await ctx.replyWithMarkdown(message, createCustomKeyboard());
  }

  @TelegramActionHandler({ message: INVITE_MESSAGE })
  async handleInvite(
    ctx: Context,
    @PipeContext(CurrentAccount) profile: Account,
    @PipeContext(MixinCustomKeyboard)
    createCustomKeyboard: CreateKustomKeyboard,
  ) {
    const inviteCode = await this.collaboration.createInvite(profile.userId);

    const message = await this.template.render(TemplateName.Invite, inviteCode);

    await ctx.replyWithMarkdown(message, createCustomKeyboard());
  }

  @TelegramActionHandler({ message: ADD_VENUE_MESSAGE })
  async handleAddVenue(
    ctx: Context,
    @PipeContext(CurrentAccount) profile: Account,
    @PipeContext(MixinCustomKeyboard)
    createCustomKeyboard: CreateKustomKeyboard,
  ) {
    const publishToken = await this.collaboration.createPublicationToken(
      profile.userId,
    );

    const message = await this.template.render(
      TemplateName.AddVenueForm,
      publishToken,
    );

    await ctx.replyWithMarkdown(message, createCustomKeyboard());
  }
}
