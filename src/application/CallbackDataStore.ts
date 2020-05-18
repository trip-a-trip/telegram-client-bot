import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import uid from 'uid';

import { CallbackData } from '&app/domain/CallbackData.entity';

@Injectable()
export class CallbackDataStore<T extends object = object> {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    @InjectRepository(CallbackData)
    private readonly repo: Repository<CallbackData<T>>,
  ) {}

  get(id: string) {
    return this.repo.findOneOrFail(id);
  }

  async save(data: T) {
    const id = uid();
    const item = new CallbackData(id, data);
    await this.em.insert(CallbackData, item);

    return id;
  }
}
