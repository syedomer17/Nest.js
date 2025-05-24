import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { signupDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
  ) {}

  // Handle user signup
  async signup(signupData: signupDto) {
    const { email, password, name } = signupData;

    // Check if email already exists
    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) {
      throw new BadRequestException('Email already in use!');
    }

    // Hash password before storing
    const hashPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = await this.UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    return {
      message: 'Signup successful!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  // Handle user login
  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    // Check if user exists
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Validate password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Return JWT and refresh token
    const tokens = await this.generateUserToken(user._id as string);
    return {
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }

  // Generate access and refresh tokens
  async generateUserToken(userId: string) {
    // Generate access token (valid for 1 day)
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1d' });

    // Generate unique refresh token using UUID
    const refreshToken = uuidv4();

    // Store refresh token in DB
    await this.storeRefreshToken(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Store refresh token with expiry date
async storeRefreshToken(token: string, userId: string) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 3); // 3 days

  await this.RefreshTokenModel.updateOne(
    { userId },
    { $set: { token, userId, expiryDate } },
    { upsert: true }
  );
}


  // Refresh access token using a valid refresh token
 async refreshToken(refreshToken: string) {
    // Check if token exists and is not expired
    const token = await this.RefreshTokenModel.findOneAndDelete({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Generate new access and refresh token
    return this.generateUserToken(token.userId.toString());
  }
}
