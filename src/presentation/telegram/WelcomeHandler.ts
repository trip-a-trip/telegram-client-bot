import { TelegramActionHandler, Context, PipeContext } from 'nest-telegram';
import { Injectable } from '@nestjs/common';

import {
  CreateKustomKeyboard,
  MixinCustomKeyboard,
} from './MixinCustomKeyboard';
import { TemplateEngine } from '../template/TemplateEngine';
import { TemplateName } from '../template/TemplateName';

@Injectable()
export class WelcomeHandler {
  constructor(private readonly template: TemplateEngine) {}

  @TelegramActionHandler({ onStart: true })
  async start(
    ctx: Context,
    @PipeContext(MixinCustomKeyboard)
    createCustomKeyboard: CreateKustomKeyboard,
  ) {
    const content = await this.template.render(TemplateName.Hello);
    await ctx.replyWithMarkdown(content, createCustomKeyboard());
  }

  @TelegramActionHandler({ command: '/help' })
  async help(
    ctx: Context,
    @PipeContext(MixinCustomKeyboard)
    createCustomKeyboard: CreateKustomKeyboard,
  ) {
    const content = await this.template.render(TemplateName.Help);
    await ctx.replyWithMarkdown(content, createCustomKeyboard());
  }
}
