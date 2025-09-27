import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscribers, SubscribersSchema } from './schema/subscriber.chema';

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService],
  imports: [
    MongooseModule.forFeature([
      { name: Subscribers.name, schema: SubscribersSchema },
    ]),
  ],
})
export class SubscribersModule {}
