import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { BaseGuildTextChannel } from 'discord.js';
import { Client } from 'discord.js';

@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async markMemberInactive(user: User) {
    this.configService
      .get<string>('RESTRICTED_CHANNEL_IDS')
      .split(',')
      .forEach((channel_id) => {
        this._addMemberToChannel(user.userId.toString(), channel_id);
      });
  }
  async markMemberActive(user: User) {
    this.configService
      .get<string>('RESTRICTED_CHANNEL_IDS')
      .split(',')
      .forEach((channel_id) => {
        this._removeMemberToChannel(user.userId.toString(), channel_id);
      });
  }
  private async _addMemberToChannel(user_id: string, channel_id: string) {
    await (
      (await this.client.channels.fetch(channel_id)) as BaseGuildTextChannel
    ).permissionOverwrites.create(user_id, {
      ViewChannel: false,
      ReadMessageHistory: false,
    });
  }
  private async _removeMemberToChannel(user_id: string, channel_id: string) {
    await (
      (await this.client.channels.fetch(channel_id)) as BaseGuildTextChannel
    ).permissionOverwrites.delete(user_id);
  }
}
