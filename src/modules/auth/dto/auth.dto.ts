import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums.js';




export class UserRegister {

    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: "this field is required" })
    email: string;

    @IsString()
    @MinLength(3, { message: 'Password must be at least 3 characters' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsEnum(UserRole, { message: 'Invalid user role specified' })
    role: UserRole = UserRole.STUDENT;

}


export class LoginRequest {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}



export class LoginResponse {
  token: string;
  id: number;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}