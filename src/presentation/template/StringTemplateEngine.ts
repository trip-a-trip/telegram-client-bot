import { Venue, VenueKind } from '@trip-a-trip/lib';
import { Configuration } from '@solid-soda/config';
import { Injectable } from '@nestjs/common';
import { take, last } from 'lodash';

import { TemplateEngine } from './TemplateEngine';
import { TemplateName } from './TemplateName';

const makeLink = (title: string, url: string) => `[${title}](${url})`;

@Injectable()
export class StringTemplateEngine implements TemplateEngine {
  constructor(private readonly config: Configuration) {}

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
      case TemplateName.Invite:
        return this.renderInvite(context);
      case TemplateName.AddVenueForm:
        return this.renderAddVenueForm(context);
      case TemplateName.Invited:
        return this.renderInvited();
      default:
        throw new Error('Template nor found');
    }
  }

  private renderInvited() {
    return [
      'Добро пожаловать 🥳',
      'Теперь ты можешь добавлять свои любимые заведения сюда, кнопка уже появилась в меню.',
      'Это большая отвественность, поэтому есть несколько правил.',
      'Во-первых, иногда я буду опрашивать людей, увидевших добавленные тобой заведения, кайфанули ли они — из ответов будет складываться твой рейтинг. Большой рейтинг — можешь приглашать друзей, маленький рейтинг — не можешь добавлять заведения. Все просто.',
      'Во-вторых, твой рейтинг влияет на рейтинг спонсора (пригласившего тебя пользователя), не подведи его.',
      'Будет здорово. Если что, пиши @igorkamyshev 🍩',
    ].join('\n\n');
  }

  private renderAddVenueForm(token: string) {
    const url = this.config.getStringOrThrow('VIEW_FORM_URL');
    return [
      `Вот [уникальная ссылка](${url}/add_venue?token=${token}), там форма, ее нужно заполинть.`,
      'По этой ссылке можно добавить только одно место, если хочется ещё — попроси новую ссылку кнопкой.',
      'Потом быстрая модерация, и, вуаля, заведение добавлено 🌝',
    ].join('\n\n');
  }

  private renderInvite(code: string) {
    return [
      `Перешли это сообщение тому, кого хочешь пригласить 🙏`,
      `Это приглашающий код — *${code}*`,
      `Его просто нужно прислать в бота — *@trip_trip_robot*`,
      'После активации можно будет свободно публиковать свои заведения 😇',
    ].join('\n\n');
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
      'Привет. Я — Игорь, и я очень люблю еду.',
      'Все заведения, где хорошо — в этом боте. Он умеет находить еду рядом, подбирать её по времени суток и предлагать разные варианты.',
      [
        'У заведений нет рейтинга, но некоторые из них помечены эмодзи:',
        '  😍 — эмейзинг место',
        '  💸 — дороговато, но без жести',
      ].join('\n'),
      'Пиши фидбеки (@igorkamyshev), рассказывай друзьям, ешь вкусно.',
      this.renderHelp(),
    ].join('\n\n');
  }

  private renderHelp() {
    return 'Отправь геопозицию, чтобы получить совет.';
  }
}
