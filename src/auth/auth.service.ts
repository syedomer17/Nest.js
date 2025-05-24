import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
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
import { nanoid } from 'nanoid';
import { ResetToken } from './schemas/reset-token.schema';
import { MailService } from 'src/service/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private ResetTokenModel: Model<ResetToken>,
    private mailService: MailService,
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
      { upsert: true },
    );
  }

  // change passsword
  async changePassword(userId, oldPassword: string, newPassword: string) {
    // find the user
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //compare the old password with the password in db
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // chanage the user's password (Don't forget to Hash it!!)
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string){
    //check that user exits 
    const user = await this.UserModel.findOne({email});

     //if user exists, generate password reset like
    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 3)

      const resetToken = nanoid(64)
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
       expiryDate
      })
      // send the link to the user by email (using nodemailer/SES etc...)
      this.mailService.sendPasswordResetEmail(email,resetToken);
    }

    return {message : "If this user exists, they will receive an email!"};
  }

  async resetPassword(newPassword: string, resetToken: string) {
  // Find a valid reset token document in ResetToken collection
  const token = await this.ResetTokenModel.findOneAndDelete({
    token: resetToken,
    expiryDate: { $gte: new Date() },
  });

  if (!token) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  // Find user associated with the token
  const user = await this.UserModel.findById(token.userId);
  if (!user) {
    throw new InternalServerErrorException('User not found');
  }

  // Hash new password and save
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // Optionally remove the used reset token
  // await this.ResetTokenModel.deleteOne({ _id: token._id });

  return { message: 'Password reset successfully!' };
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
