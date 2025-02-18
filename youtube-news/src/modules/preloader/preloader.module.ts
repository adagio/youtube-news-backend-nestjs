import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../../entities/channel.entity';
import { Video } from '../../entities/video.entity';
import { VideoPreloader } from './video.preloader';
import { YouTubeClientService } from '../../services/youtube-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Video]),
  ],
  providers: [VideoPreloader, YouTubeClientService],
  exports: [VideoPreloader],
})
export class PreloaderModule {}