import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Video } from '../../entities/video.entity';
import { Channel } from '../../entities/channel.entity';
import { YouTubeClientService } from '../../services/youtube-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, Channel]),
  ],
  controllers: [VideosController],
  providers: [VideosService, YouTubeClientService],
  exports: [VideosService],
})
export class VideosModule {}
