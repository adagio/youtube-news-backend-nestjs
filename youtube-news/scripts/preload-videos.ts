import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { VideoPreloader } from '../src/modules/preloader/video.preloader';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const videoPreloader = app.get(VideoPreloader);
    
    console.log('Starting video preload...');
    await videoPreloader.preloadVideos();
    console.log('Video preload completed successfully');
    
    await app.close();
  } catch (error) {
    console.error('Bootstrap error:', error);
    process.exit(1);
  }
}

bootstrap();