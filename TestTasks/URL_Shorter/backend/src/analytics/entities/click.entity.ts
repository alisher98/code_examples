import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ShortUrl } from '../../short-url/entities/short-url.entity';

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @CreateDateColumn()
  clickedAt: Date;

  @ManyToOne(() => ShortUrl, (shortUrl) => shortUrl.clicks, {
    onDelete: 'CASCADE',
  })
  shortUrl: ShortUrl;
}
