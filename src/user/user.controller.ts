import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Create a new User
  @Post()
  @ResponseMessage('Create a new User')
  async create(@Body() createUserDTO: CreateUserDto, @User() user: IUser) {
    let newUser = await this.userService.create(createUserDTO, user);

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  // Fetch all user with paginate
  @Get()
  @ResponseMessage('Fetch users with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.userService.findAll(+currentPage, +limit, qs);
  }

  // Fetch a user by id
  @Public()
  @Get(':id')
  @ResponseMessage('fetch user by id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.userService.findOne(id);
    return foundUser;
  }

  // Update a user
  @Patch()
  @ResponseMessage('Update a User')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updateUser = await this.userService.update(updateUserDto, user);
    return updateUser;
  }

  // Delete a user
  @Delete(':id')
  @ResponseMessage('Delete a User')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.userService.remove(id, user);
  }
}
