import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async findOne(userId: number): Promise<User | undefined> {
    return this.database.user.findUnique({
      where: {
        user_id: userId,
      },
    });
  }

  async createOne(user_id: number, name: string): Promise<User> {
    const user = this.findOne(user_id);
    this.createStats(user_id);
    return user
      ? user
      : await this.database.user.create({
          data: {
            user_id,
            name,
          },
        });
  }
  private async createStats(user_id: number) {
    this.database.stats.create({
      data: {
        userId: user_id,
      },
    });
  }

  async insertMessage(user_id: number, message_id: number) {
    await this.getStatsOrCreate(user_id);
    // insert into this.datanase.messages with date.now(), message id userid, stats id
    throw new Error('Method not implemented.');
  }
  async incrementMessagePoints(value: number, user_id: number) {
    value += (await this.findOne(user_id)).message_points;
    this.database.user.update({
      where: {
        user_id,
      },
      data: {
        message_points: value,
      },
    });
  }
  async decrementMessagePoints(value: number, user_id: number) {
    value -= (await this.findOne(user_id)).message_points;
    this.database.user.update({
      where: {
        user_id,
      },
      data: {
        message_points: value,
      },
    });
  }
  async deleteOne(user_id: number): Promise<void> {
    this.database.user.delete({
      where: {
        userId: user_id,
      },
    });
  }
  async findAll(): Promise<Array<User>> {
    return this.database.user.findMany();
  }

  async updateMessageCountBucket(user: User): Promise<void> {
    throw new Error('Function not implemented.');
  }
  async isActive(user: User): Promise<boolean> {
    throw new Error('Function not implemented.');
  }
  private async getStatsOrCreate(user_id: number) {
    throw new Error('Function not implemented.');
  }
}
