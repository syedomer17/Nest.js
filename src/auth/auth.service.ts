import { BadRequestException, Injectable } from '@nestjs/common';
import { signupDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async signup(signupData: signupDto) {

    const {email,  password, name} = signupData;
    // check if email is in use
    const emailInUse = await this.UserModel.findOne({email : email,});

    if(emailInUse){
        throw new BadRequestException('Email already in use!')
    }
    // hask password
    const hashPassword = await bcrypt.hash(password, 10);
    // create user document and save the user in the db
    await this.UserModel.create({
        name,
        email,
        password : hashPassword
    })
  }
}
