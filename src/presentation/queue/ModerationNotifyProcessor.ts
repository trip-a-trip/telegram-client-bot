import { MODERATION_NOTIFY_QUEUE, Draft } from '@trip-a-trip/lib';
import { InjectRepository } from '@nestjs/typeorm';
import { Processor, Process } from '@nestjs/bull';
import { TelegramClient } from 'nest-telegram';
import { Repository } from 'typeorm';
import { Job } from 'bull';

import { Account } from '&app/domain/Account.entity';

import { TemplateEngine } from '../template/TemplateEngine';
import { TemplateName } from '../template/TemplateName';

@Processor(MODERATION_NOTIFY_QUEUE)
export class ModerationNotifyProcessor {
  constructor(
    private readonly template: TemplateEngine,
    private readonly telegram: TelegramClient,
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  @Process()
  async handle(job: Job<Draft>) {
    try {
      const [message, account] = await Promise.all([
        this.template.render(TemplateName.Moderated, job.data),
        this.repo.findOneOrFail({ userId: job.data.authorId }),
      ]);

      await this.telegram.sendMarkdown(account.id, message);

      await job.moveToCompleted();
    } catch (error) {
      console.error(error);
      await job.moveToFailed(error);
    }
  }
}
