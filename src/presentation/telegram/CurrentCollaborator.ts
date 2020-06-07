import { ContextTransformer, Context } from 'nest-telegram';
import { CollaborationClient, Collaborator } from '@trip-a-trip/lib';
import { Injectable } from '@nestjs/common';

import { CurrentAccount } from './CurrentAccount';

@Injectable()
export class CurrentCollaborator
  implements ContextTransformer<Collaborator | null> {
  constructor(
    private readonly currentAaccount: CurrentAccount,
    private readonly collaboration: CollaborationClient,
  ) {}

  async transform(ctx: Context) {
    if (!ctx.from || !ctx.from.id) {
      throw new Error('Ok');
    }

    const account = await this.currentAaccount.transform(ctx);
    try {
      const collaborator = await this.collaboration.getProfile(account.userId);

      return collaborator;
    } catch (error) {
      return null;
    }
  }
}
