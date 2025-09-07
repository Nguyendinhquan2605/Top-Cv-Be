import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/user/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login')
  @Post('/login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  // Register a user
  @Public()
  @ResponseMessage('Register a new User')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  // Get information Acocunt
  @ResponseMessage('Get user information')
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }
}
