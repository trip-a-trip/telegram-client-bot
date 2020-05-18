import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('callback_data')
export class CallbackData<T extends object = object> {
  @PrimaryColumn({ name: 'id' })
  private readonly id: string;

  @Column({ name: 'data', type: 'jsonb' })
  readonly data: T;

  constructor(id: string, data: T) {
    this.id = id;
    this.data = data;
  }
}
