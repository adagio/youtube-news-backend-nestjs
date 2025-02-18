import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ChannelsService } from '../src/modules/channels/channels.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    const configService = app.get(ConfigService);
    const apiKey = configService.get('YOUTUBE_API_KEY');

    const channelsService = app.get(ChannelsService);

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

    for (const channel of channels) {
      try {
        await channelsService.create(channel);
        console.log(`Created channel: ${channel.name}`);
      } catch (error) {
        console.error(`Failed to create channel ${channel.name}:`, error.message);
      }
    }

    await app.close();
  } catch (error) {
    console.error('Bootstrap error:', error.message);
    process.exit(1);
  }
}

bootstrap();