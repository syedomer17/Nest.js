import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST auth/signup
  @Post('signup')
  async signUp(@Body() signupData: signupDto) {
    return this.authService.signup(signupData)
    
  }
  
}
