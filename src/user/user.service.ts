import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user_schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  // Create a new user
  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { name, email, password, age, gender, address, role, company } =
      createUserDto;
    // Check email
    const isExist = await this.userModel.findOne({ email: email });
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    const hashPassword = this.getHashPassword(password);

    let Newuser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return Newuser;
  }

  // Register a new User
  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;

    // Check email
    const isExist = await this.userModel.findOne({ email: email });
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });

    return newRegister;
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
