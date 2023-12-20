import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/Chat.module';

@Module({
  imports: [PrismaModule, ChatModule],
})
export class AppModule {}
