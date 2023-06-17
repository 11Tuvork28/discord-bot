import { Inject, Injectable } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, GuildMember, Presence } from 'discord.js';
import { UserService } from 'src/users/user.service';

@Injectable()
export class BotGateway {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Once('ready')
  async onReady() {
    const members = await this.client.guilds.cache.at(0).members.fetch();
    members.forEach(async (member: GuildMember) => {
      if (!member.user.bot)
        await this.userService.findOrCrate(
          parseInt(member.id),
          member.user.username,
        );
    });
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    await this.userService.findOrCrate(parseInt(member.id), member.user.username);
  }

  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    await this.userService.deleteOne(parseInt(member.id));
  }

  @On('presenceUpdate')
  async presenceUpdate(
    oldMemberPresence: Presence,
    newMemberPresence: Presence,
  ) {
    console.log(oldMemberPresence.status, newMemberPresence.status);
  }
}
