import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums.js';




export class UserProfileUpdate {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}



export class UserResponse {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  classroomId?: number | null;
}



export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @MinLength(3, { message: 'New password must be at least 3 characters long' })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}