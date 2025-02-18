import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../entities/video.entity';
import { YouTubeClientService } from '../../services/youtube-client.service';

interface FindAllOptions {
  skip?: number;
  limit?: number;
  title?: string;
  channelId?: number;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private youtubeClient: YouTubeClientService,
  ) {}

  async findAll({
    skip = 0,
    limit = 10,
    title,
    channelId,
    startDate,
    endDate,
  }: FindAllOptions) {
    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.channel', 'channel')
      .select([
        'video.id',
        'video.title',
        'video.description',
        'video.videoId',
        'video.url',
        'video.uploadDate',
        'video.createdAt',
        'channel.id',
        'channel.name'
      ])
      .orderBy('video.uploadDate', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilder.andWhere('video.title LIKE :title', { title: `%${title}%` });
    }

    if (channelId) {
      queryBuilder.andWhere('channel.id = :channelId', { channelId });
    }

    if (startDate) {
      queryBuilder.andWhere('video.uploadDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('video.uploadDate <= :endDate', { endDate });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    const formattedItems = items.map(item => ({
      ...item,
      channelName: item.channel.name,
      channelId: item.channel.id,
    }));

    return {
      items: formattedItems,
      total,
      skip,
      limit,
    };
  }
}
