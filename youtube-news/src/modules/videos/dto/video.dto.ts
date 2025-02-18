import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  videoId: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  uploadDate: Date;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  channelName: string;
}