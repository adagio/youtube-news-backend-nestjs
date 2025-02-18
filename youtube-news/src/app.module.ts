import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Channel } from './entities/channel.entity';
import { Video } from './entities/video.entity';
import { ChannelsModule } from './modules/channels/channels.module';
import { PreloaderModule } from './modules/preloader/preloader.module';
import { VideosModule } from './modules/videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'youtube.db',
      entities: [Channel, Video],
      synchronize: true,
    }),
    ChannelsModule,
    PreloaderModule,
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
