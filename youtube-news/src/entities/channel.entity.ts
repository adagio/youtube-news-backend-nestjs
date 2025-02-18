import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Video } from './video.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  channelId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Video, (video) => video.channel)
  videos: Video[];
}
