import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RateLimiter } from './rate-limiter';

@Injectable()
export class YouTubeClientService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';
  private readonly rateLimiter: RateLimiter;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY is not defined in the configuration');
    }
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(100, 100); // 100 requests per 100 seconds
  }

  private async makeApiRequest<T>(endpoint: string, params: Record<string, any>): Promise<T> {
    await this.rateLimiter.waitForSlot();
    
    try {
      const response = await axios.get<T>(`${this.baseUrl}/${endpoint}`, {
        params: {
          ...params,
          key: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;
        
        if ([403, 500, 503].includes(status)) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          return this.makeApiRequest(endpoint, params);
        }
        
        throw new HttpException(
          `YouTube API error: ${error.response.data?.error?.message || error.message}`,
          status,
        );
      }
      
      throw new HttpException(
        'Failed to connect to YouTube API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChannelIdFromHandle(handle: string): Promise<string> {
    // Remove @ if present
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    
    const response = await this.makeApiRequest<any>('search', {
      q: `@${cleanHandle}`,
      type: 'channel',
      part: 'id',
      maxResults: 1,
    });
    
    const items = response.items || [];
    if (items.length > 0) {
      return items[0].id.channelId;
    }
    
    throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
  }

  async getLatestVideos(channelId: string, maxResults = 10): Promise<any[]> {
    const response = await this.makeApiRequest<any>('search', {
      channelId,
      part: 'snippet',
      order: 'date',
      type: 'video',
      maxResults,
    });
    
    const items = response.items || [];
    return items.filter(item => item?.id?.kind === 'youtube#video');
  }

  async getVideoDetails(videoId: string): Promise<any[]> {
    const response = await this.makeApiRequest<any>('videos', {
      part: 'snippet',
      id: videoId,
    });
    
    return response.items || [];
  }
}