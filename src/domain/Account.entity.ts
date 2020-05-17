import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('account')
export class Account {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
  }
}
