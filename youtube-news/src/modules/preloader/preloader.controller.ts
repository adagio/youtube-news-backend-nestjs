import { Controller, Post, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VideoPreloader } from './video.preloader';

@ApiTags('preloader')
@Controller('preloader')
export class PreloaderController {
  constructor(private readonly videoPreloader: VideoPreloader) {}

  @Post('videos')
  @ApiOperation({ summary: 'Trigger video preload process' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Video preload process completed successfully' 
  })
  async preloadVideos() {
    await this.videoPreloader.preloadVideos();
    return { message: 'Video preload completed successfully' };
  }
}