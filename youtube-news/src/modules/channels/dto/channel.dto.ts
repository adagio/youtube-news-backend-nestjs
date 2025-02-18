import { ApiProperty } from '@nestjs/swagger';

export class ChannelDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  channelId: string;

  @ApiProperty()
  createdAt: Date;
}

export interface FindAllChannelsOptions {
  skip?: number;
  limit?: number;
  search?: string;
}