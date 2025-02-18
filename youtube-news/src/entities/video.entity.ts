import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Channel } from './channel.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ unique: true })
  videoId: string;

  @Column()
  url: string;

  @Column()
  uploadDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Channel, channel => channel.videos)
  channel: Channel;
}
