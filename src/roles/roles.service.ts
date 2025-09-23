import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schema/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/user/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  // create a new role
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const exist = await this.roleModel.findOne({ name: name });
    if (exist) {
      throw new BadRequestException(`Role với ${name} đã tồn tại!`);
    }

    const newRole = await this.roleModel.create({
      name: name,
      description: description,
      isActive: isActive,
      permissions: permissions,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newRole?.id,
      createdAt: newRole?.createdAt,
    };
  }

  // Fetch all role with paginate
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 3;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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

  // Fetch role by id
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('not found role');
    }

    const data = await this.roleModel.findById(id);
    return data;
  }

  // Update a role
  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('not found role');
    }

    const { name, description, isActive, permissions } = updateRoleDto;
    const update = await this.roleModel.updateOne(
      { _id: id },
      {
        name: name,
        description: description,
        isActive: isActive,
        permissions: permissions,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return update;
  }

  // Delete a role
  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found role!';
    }

    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.roleModel.softDelete({ _id: id });
  }
}
