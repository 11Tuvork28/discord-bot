import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async findOne(userId: number): Promise<User | undefined> {
    return this.database.user.findUnique({ where: { userId } });
  }

  async findOrCrate(userId: number, name: string): Promise<User> {
    const user = await this.findOne(userId);
    if (user) return user;

    await this.database.user.create({
      data: { userId, name },
    });
    await this.database.stats.create({
      data: { userId },
    });
    return this.findOne(userId);
  }

  async insertMessage(userId: number, messageId: number) {
    this.database.message.create({
      data: {
        userId,
        messageId,
        createdAt: new Date(),
      },
    });
    // insert into this.datanase.messages with date.now(), message id userid, stats id
    throw new Error('Method not implemented.');
  }
  async incrementMessagePoints(value: number, userId: number) {
    this.database.stats.update({
      where: { userId },
      data: { message_points: { increment: 1 } },
    });
  }
  async decrementMessagePoints(value: number, userId: number) {
    this.database.stats.update({
      where: { userId },
      data: { message_points: { decrement: 1 } },
    });
  }
  async deleteOne(userId: number): Promise<void> {
    this.database.user.delete({ where: { userId } });
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
}
