import { TelegramErrorHandler, Context, TelegramCatch } from 'nest-telegram';

@TelegramCatch(Error)
export class TelegramErrorCatcher implements TelegramErrorHandler {
  async catch(ctx: Context, error: any): Promise<void> {
    console.error(error);

    ctx.reply(
      [
        'Что-то пошло не так. Мне очень жаль.',
        'Пожалуйста, напиши @igorkamyshev и расскажи что случилось 🙏',
      ].join('\n\n'),
    );
  }
}
