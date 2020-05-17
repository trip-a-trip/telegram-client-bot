import { Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { ContextTransformer, Context } from 'nest-telegram';
import { UserClient } from '@trip-a-trip/lib';

import { Account } from '&app/domain/Account.entity';

@Injectable()
export class CurrentAccount implements ContextTransformer<Account> {
  constructor(
    private readonly users: UserClient,
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async transform(ctx: Context) {
    if (!ctx.from || !ctx.from.id) {
      throw new Error('Ok');
    }

    const accountId = ctx.from.id.toString();

    const existAccount = await this.repo.findOne(accountId);

    if (existAccount) {
      return existAccount;
    }

    const userId = await this.users.signUp();

    const newAccount = new Account(accountId, userId);

    await this.em.insert(Account, newAccount);

    return newAccount;
  }
}
