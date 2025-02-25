import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { Video } from '../../entities/video.entity';
import { YouTubeClientService } from '../../services/youtube-client.service';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
  };
}

@Injectable()
export class VideoPreloader {
  private readonly logger = new Logger(VideoPreloader.name);
  private readonly BATCH_SIZE = 5; // Process 5 channels concurrently

  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private youtubeClient: YouTubeClientService,
  ) {}

  async preloadVideos(): Promise<void> {
    const channels = await this.channelRepository.find();
    const batches = this.chunkArray(channels, this.BATCH_SIZE);
    
    for (const batch of batches) {
      await Promise.all(batch.map(channel => this.processChannel(channel)));
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private async processChannel(channel: Channel): Promise<void> {
    this.logger.log(`Fetching videos for channel: ${channel.name}`);
    
    try {
      const videos = await this.youtubeClient.getLatestVideos(channel.channelId);
      await Promise.all(videos.map(video => this.processVideo(video, channel)));
    } catch (error) {
      this.logger.error(`Error fetching videos for channel ${channel.name}: ${error.message}`);
    }
  }

  private async processVideo(video: any, channel: Channel): Promise<void> {
    const videoId = video.id.videoId;
    
    try {
      const existingVideo = await this.videoRepository.findOne({
        where: { videoId },
      });

      if (!existingVideo) {
        const videoData: Partial<Video> = {
          title: video.snippet.title,
          description: video.snippet.description,
          videoId: videoId,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          uploadDate: new Date(video.snippet.publishedAt),
          channel: channel,
        };

        const newVideo = this.videoRepository.create(videoData);
        await this.videoRepository.save(newVideo);
        this.logger.log(`Created video: ${newVideo.title}`);
      }
    } catch (error) {
      this.logger.error(`Error processing video ${videoId}: ${error.message}`);
    }
  }
}