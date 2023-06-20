import { InjectDiscordClient } from '@discord-nestjs/core';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  Client,
  GuildBasedChannel,
  GuildChannel,
  Role,
  User,
} from 'discord.js';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';

@Controller('bot')
@UseGuards(JwtAuthGuard)
export class BotController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Get('guild/:guildId/users')
  async getGuildUsers(@Param('guildId') guildId: string): Promise<User[]> {
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    return members.map((member) => member.user);
  }

  @Get('guild/:guildId/channels')
  async getGuildChannels(
    @Param('guildId') guildId: string,
  ): Promise<GuildChannel[]> {
    const guild = await this.client.guilds.fetch(guildId);
    return (await guild.channels.fetch()).toJSON();
  }

  @Put('guild/:guildId/channel/:channelId')
  async editChannel(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() channelData: Partial<Record<string, unknown>>,
  ): Promise<GuildBasedChannel> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);
    await channel.edit(channelData);
    return channel;
  }

  @Post('guild/:guildId/user/:userId/ban')
  async banUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.ban(userId);
  }

  @Post('guild/:guildId/user/:userId/kick')
  async kickUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.kick(userId);
  }

  @Post('guild/:guildId/user/:userId/timeout')
  async timeoutUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    await member.voice.setMute(true);
  }

  @Post('guild/:guildId/channel/:channelId/slowmode')
  async setSlowmode(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() { duration }: { duration: number },
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId) as GuildChannel;
    await channel.edit({ rateLimitPerUser: duration });
  }
  @Put('guild/:guildId/role/:roleId')
  async updateRole(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
    @Body() roleData: Partial<Record<string, unknown>>,
  ): Promise<Role> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = guild.roles.cache.get(roleId);
    await role.edit(roleData);

    return role;
  }

  @Delete('guild/:guildId/role/:roleId')
  async deleteRole(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = guild.roles.cache.get(roleId);
    await role.delete();
  }
}
