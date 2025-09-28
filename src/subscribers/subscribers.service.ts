import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscribers, SubscribersDocument } from './schema/subscriber.chema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscribers.name)
    private subscriberModel: SoftDeleteModel<SubscribersDocument>,
  ) {}

  // Create a subscribers
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { name, email, skills } = createSubscriberDto;
    const isExist = await this.subscriberModel.findOne({ email: email });
    if (isExist) {
      throw new BadGatewayException(`Email: ${email}đã tồn tại trên hệ thống!`);
    }

    const newSubscriber = await this.subscriberModel.create({
      name: name,
      email: email,
      skills: skills,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newSubscriber?._id,
      createdAt: newSubscriber?.createdAt,
    };
  }

  // Fetch all subscribers with paginate
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 3;
    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subscriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  // Fetch subscriber by id
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('not found subscriber');
    }

    const subscriber = await this.subscriberModel.findById(id);
    return subscriber;
  }

  // Update a subscriber by id
  async update(
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('not found subscriber');
    }
    const updated = await this.subscriberModel.updateOne(
      { _id: id },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  // Delete a subscriber
  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('not found subscriber');
    }

    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );

    return this.subscriberModel.softDelete({ _id: id });
  }
}
