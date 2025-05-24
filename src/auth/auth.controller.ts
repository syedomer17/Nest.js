import {
  Controller,
  Put,
  Body,
  UseGuards,
  Req,
  Post,
  ValidationPipe,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/signup - Register a new user
  @Post('signup')
  async signUp(@Body() signupData: signupDto) {
    return this.authService.signup(signupData);
  }

  // POST /auth/login - Login user and return tokens
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  // POST /auth/refresh - Refresh the access token using refresh token
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  //POST /auth/change-password  - change password
  @UseGuards(AuthGuard('jwt'))
@Put('change-password')
async changePassword(
  @Body() changePasswordDto: ChangePasswordDto,
  @Req() req: Request & { user?: any }, // user is injected by the JWT strategy
) {
  if (!req.user || !req.user.userId) {
    throw new UnauthorizedException('User ID missing from request');
  }

  const userId = req.user.userId;

  const result = await this.authService.changePassword(
    userId,
    changePasswordDto.oldPassword,
    changePasswordDto.newPassword,
  );

  if (!result) {
    throw new UnauthorizedException('Wrong credentials');
  }

  return {
    statusCode: 200,
    message: 'Password changed successfully',
  };
}
}
