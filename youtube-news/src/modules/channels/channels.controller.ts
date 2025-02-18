import { Controller, Get, Post, Delete, Put, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { Channel } from '../../entities/channel.entity';
import { ChannelDto } from './dto/channel.dto';

interface CreateChannelDto {
  name: string;
  channelHandle: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all channels with pagination and search' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, type: [ChannelDto] })
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('search') search?: string,
  ): Promise<PaginatedResponse<Channel>> {
    return this.channelsService.findAll({ skip, limit, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific channel by ID' })
  @ApiResponse({ status: 200, type: ChannelDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Channel> {
    return this.channelsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiResponse({ status: 201, type: ChannelDto })
  async create(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
    return this.channelsService.create(createChannelDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a channel' })
  @ApiResponse({ status: 200, type: ChannelDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Channel>,
  ): Promise<Channel> {
    return this.channelsService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a channel' })
  @ApiResponse({ status: 200, type: ChannelDto })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Channel> {
    return this.channelsService.remove(id);
  }
}