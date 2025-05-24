import { IsEmail, IsString, Matches, MinLength, IsNotEmpty } from "class-validator";

export class signupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9]).+$/, { message: 'password must contain at least one number' })
  @IsNotEmpty()
  password: string;
}
