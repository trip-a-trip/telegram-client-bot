import { ContextTransformer, Context } from 'nest-telegram';
import { Collaborator } from '@trip-a-trip/lib';
import { Injectable } from '@nestjs/common';
import merge from 'deepmerge';

import { INVITE_MESSAGE, ADD_VENUE_MESSAGE } from './constants';
import { CurrentCollaborator } from './CurrentCollaborator';

export type CreateСustomKeyboard = (initial?: object) => object;

@Injectable()
export class MixinCustomKeyboard
  implements ContextTransformer<CreateСustomKeyboard> {
  constructor(private readonly currentCollaborator: CurrentCollaborator) {}

  async transform(ctx: Context) {
    if (!ctx.from || !ctx.from.id) {
      throw new Error('Ok');
    }

    const collaborator = await this.currentCollaborator.transform(ctx);

    return (initial = {}) => {
      const reply: object[] = [this.geoMarkup];

      if (collaborator) {
        reply.push(this.getCollaboratorMarkup(collaborator));
      }

      return reply.reduce((a, b) => merge(a, b), initial);
    };
  }

  private getCollaboratorMarkup = (collaborator: Collaborator) => {
    const buttons: string[] = [];

    if (collaborator.canInvite) {
      buttons.push(INVITE_MESSAGE);
    }
    if (collaborator.canPublish) {
      buttons.push(ADD_VENUE_MESSAGE);
    }

    return {
      reply_markup: {
        keyboard: [buttons.map((text) => ({ text }))],
      },
    };
  };

  private geoMarkup = {
    reply_markup: {
      keyboard: [[{ text: 'Отправить геометку', request_location: true }]],
      resize_keyboard: true,
    },
  };
}
