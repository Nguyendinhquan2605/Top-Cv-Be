import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user_schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);

    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });
    return user;
  }

  // Get All Users
  findAll() {
    return this.userModel.find();
  }

  // Get user by id
  findOne(id: string) {
    try {
      return this.userModel.findOne({
        _id: id,
      });
    } catch (error) {
      console.log('check error: ', error);
      return 'not found user';
    }
  }

  // Get user by username
  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  // check user Password
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash); // false
  }

  // Update a user by id
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
      },
    );
  }

  // Delete a user by id
  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found user!';
    }

    return this.userModel.softDelete({ _id: id });
  }
}
