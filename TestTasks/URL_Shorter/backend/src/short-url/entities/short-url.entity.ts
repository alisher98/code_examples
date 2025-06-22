import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Click } from '../../analytics/entities/click.entity';

@Entity()
export class ShortUrl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalUrl: string;

  @Column({ unique: true, length: 20 })
  alias: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: 0 })
  clickCount: number;

  @OneToMany(() => Click, (click) => click.shortUrl)
  clicks: Click[];
}
