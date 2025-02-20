import { Controller, Post, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VideoPreloader } from './video.preloader';
import { ChannelsService } from '../channels/channels.service';

@ApiTags('preloader')
@Controller('preloader')
export class PreloaderController {
  constructor(
    private readonly videoPreloader: VideoPreloader,
    private readonly channelsService: ChannelsService,
  ) {}

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

  @Post('channels')
  @ApiOperation({ summary: 'Trigger channels preload process' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Channels preload process completed successfully'
  })
  async preloadChannels() {
    const channels = [
      { name: 'Cosas Militares', channelHandle: '@CosasMilitares' },
      { name: 'Monitor Fantasma', channelHandle: '@Monitorfantasma' },
      { name: 'Oscar Vara', channelHandle: '@oscarvara' },
      { name: 'Marc Vidal', channelHandle: '@marc_vidal' },
      { name: 'Alex Fidalgo', channelHandle: '@Loquetudigas' },
      { name: 'Cascarón de Nuez', channelHandle: '@jfcalero' },
      { name: 'JF Calero Manual', channelHandle: '@jfcaleroMANUAL' },
      { name: 'Gustavo Entrala', channelHandle: '@@gustavo-entrala' },
      { name: 'Noticias Ilustradas', channelHandle: '@NOTICIASILUSTRADAS' },
      { name: 'Dudas eternas', channelHandle: '@DudasEternas' },
      { name: 'midulive', channelHandle: '@midulive' },
      { name: 'midudev', channelHandle: '@midudev' },
      { name: 'MoureDev TV', channelHandle: '@mouredevtv' },
      { name: 'MoureDev', channelHandle: '@mouredev' },
      { name: 'Dot CSV', channelHandle: '@dotcsv' },
      { name: 'Dot CSV Lab', channelHandle: '@DotCSVLab' },
      { name: 'Fazt', channelHandle: '@FaztTech' },
      { name: 'Plazti', channelHandle: '@Platzi' },
      { name: 'VisualPolitik', channelHandle: '@VisualPolitik' },
      { name: 'VisualEconomik', channelHandle: '@VisualEconomik' },
    ];

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const channel of channels) {
      try {
        await this.channelsService.create(channel);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${channel.name}: ${error.message}`);
      }
    }

    return {
      message: 'Channels preload process completed',
      results
    };
  }
}