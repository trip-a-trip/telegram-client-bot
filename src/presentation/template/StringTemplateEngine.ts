import { Injectable } from '@nestjs/common';
import { Venue, VenueKind } from '@trip-a-trip/lib';

import { TemplateEngine } from './TemplateEngine';
import { TemplateName } from './TemplateName';

@Injectable()
export class StringTemplateEngine implements TemplateEngine {
  async render(name: TemplateName, context?: any): Promise<string> {
    switch (name) {
      case TemplateName.Venue:
        return this.renderVenue(context);
      case TemplateName.NotFound:
        return this.renderNotFound();
      default:
        throw new Error('Template nor found');
    }
  }

  private renderVenue(venue: Venue) {
    const marks = [venue.isAmazing && '😍', venue.isExpensive && '💸']
      .filter(Boolean)
      .join(' ');
    const kindMap = {
      [VenueKind.BiteDrink]: 'выпить чаю/кофе',
      [VenueKind.Lunch]: 'пообедать',
      [VenueKind.Breakfast]: 'позавтракать',
      [VenueKind.Dinner]: 'поужинать',
    };

    const kinds = venue.kind.map((kind) => kindMap[kind]).join(', ');

    return [
      `${marks} *${venue.name}*`,
      venue.description,
      venue.kind.length > 0 && `Тут можно _${kinds}_.`,
      venue.address &&
        `[${venue.address}](https://maps.google.com?q=${encodeURI(
          venue.address,
        )})`,
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  private renderNotFound() {
    return 'Я не знаю где поесть в этой локации, сорян 🌚';
  }
}
