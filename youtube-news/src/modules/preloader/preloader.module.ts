import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../../entities/channel.entity';
import { Video } from '../../entities/video.entity';
import { VideoPreloader } from './video.preloader';
import { PreloaderController } from './preloader.controller';
import { YouTubeClientService } from '../../services/youtube-client.service';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Video]),
    ChannelsModule,
  ],
  controllers: [PreloaderController],
  providers: [VideoPreloader, YouTubeClientService],
  exports: [VideoPreloader],
})
export class PreloaderModule {}