import { Injectable } from '@nestjs/common';
import { Venue, VenueKind } from '@trip-a-trip/lib';
import { take, last } from 'lodash';

import { TemplateEngine } from './TemplateEngine';
import { TemplateName } from './TemplateName';

const makeLink = (title: string, url: string) => `[${title}](${url})`;

@Injectable()
export class StringTemplateEngine implements TemplateEngine {
  async render(name: TemplateName, context?: any): Promise<string> {
    switch (name) {
      case TemplateName.Venue:
        return this.renderVenue(context);
      case TemplateName.NotFound:
        return this.renderNotFound();
      case TemplateName.NoMore:
        return this.renderNoMore();
      case TemplateName.Hello:
        return this.renderHello();
      case TemplateName.Help:
        return this.renderHelp();
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

    const kindVariants = venue.kind.map((kind) => kindMap[kind]);

    const kinds =
      kindVariants.length > 1
        ? `${take(kindVariants, kindVariants.length - 1).join(', ')} и ${last(
            kindVariants,
          )}`
        : last(kindVariants);

    const links = venue.links
      .map((link) => makeLink(link.title, link.url))
      .join('\n');

    return [
      `${marks} *${venue.name}*`,
      venue.description,
      venue.kind.length > 0 && `Тут можно _${kinds}_.`,
      venue.address &&
        makeLink(
          venue.address,
          `https://maps.google.com?q=${encodeURI(venue.address)}`,
        ),
      links,
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  private renderNotFound() {
    return 'Я не знаю где поесть в этой локации, сорян 🌚';
  }

  private renderNoMore() {
    return 'Больше вариантов нет 🦁';
  }

  private renderHello() {
    return [
      'Привет. Я — Игорь Камышев, и я очень люблю еду.',
      'Все заведения, где хорошо — в этом боте. Он умеет находить еду рядом, подбирать её по времени суток и предлагать разные варианты.',
      [
        'Это мои представления о прекрасном. У заведений нет рейтинга, но некоторые из них помечены эмодзи:',
        ' 😍 — эмейзинг место',
        ' 💸 — дороговато, но без жести',
      ].join('\n'),
      'Пиши фидбеки (@igorkamyshev), рассказывай друзьям, ешь вкусно.',
      this.renderHelp(),
    ].join('\n\n');
  }

  private renderHelp() {
    return 'Отправь геопозицию, чтобы получить совет.';
  }
}
