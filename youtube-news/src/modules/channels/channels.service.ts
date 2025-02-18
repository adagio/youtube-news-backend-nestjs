import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { YouTubeClientService } from '../../services/youtube-client.service';
import { FindAllChannelsOptions } from './dto/channel.dto';

interface CreateChannelDto {
  name: string;
  channelHandle: string;
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    private youtubeClient: YouTubeClientService,
  ) {}

  async findAll({ skip = 0, limit = 10, search }: FindAllChannelsOptions) {
    const queryBuilder = this.channelsRepository
      .createQueryBuilder('channel')
      .orderBy('channel.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.where('channel.name LIKE :search', { search: `%${search}%` });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      skip,
      limit
    };
  }

  async findById(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }

    return channel;
  }

  async create({ name, channelHandle }: CreateChannelDto): Promise<Channel> {
    // Check if channel already exists
    const existingChannel = await this.channelsRepository.findOne({
      where: [{ name }, { channelId: channelHandle }],
    });

    if (existingChannel) {
      throw new ConflictException('Channel already exists');
    }

    const channelId =
      await this.youtubeClient.getChannelIdFromHandle(channelHandle);

    if (!channelId) {
      throw new NotFoundException(
        `Could not find channel ID for handle: ${channelHandle}`,
      );
    }

    const channel = this.channelsRepository.create({
      name,
      channelId,
    });

    try {
      return await this.channelsRepository.save(channel);
    } catch (error) {
      throw new Error(`Failed to create channel: ${error.message}`);
    }
  }

  async remove(id: number): Promise<Channel> {
    const channel = await this.findById(id);

    try {
      return await this.channelsRepository.remove(channel);
    } catch (error) {
      throw new Error(`Failed to remove channel: ${error.message}`);
    }
  }

  async update(id: number, updateData: Partial<Channel>): Promise<Channel> {
    const channel = await this.findById(id);

    Object.assign(channel, updateData);

    try {
      return await this.channelsRepository.save(channel);
    } catch (error) {
      throw new Error(`Failed to update channel: ${error.message}`);
    }
  }
}
