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

  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private youtubeClient: YouTubeClientService,
  ) {}

  async preloadVideos(): Promise<void> {
    const channels = await this.channelRepository.find();
    
    for (const channel of channels) {
      this.logger.log(`Fetching videos for channel: ${channel.name}`);
      
      try {
        const videos = await this.youtubeClient.getLatestVideos(channel.channelId);
    
        for (const video of videos as YouTubeVideo[]) {
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
      } catch (error) {
        this.logger.error(`Error fetching videos for channel ${channel.name}: ${error.message}`);
      }
    }
  }
}