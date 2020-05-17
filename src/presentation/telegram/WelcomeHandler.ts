import { TelegramActionHandler, Context } from 'nest-telegram';
import { Injectable } from '@nestjs/common';

import { TemplateEngine } from '../template/TemplateEngine';
import { TemplateName } from '../template/TemplateName';

@Injectable()
export class WelcomeHandler {
  constructor(private readonly template: TemplateEngine) {}

  @TelegramActionHandler({ onStart: true })
  async start(ctx: Context) {
    const content = await this.template.render(TemplateName.Hello);
    await ctx.replyWithMarkdown(content);
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    const content = await this.template.render(TemplateName.Help);
    await ctx.replyWithMarkdown(content);
  }
}
