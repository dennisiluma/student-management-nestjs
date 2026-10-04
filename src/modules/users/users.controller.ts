import { Body, Controller, Get, HttpCode, HttpStatus, Put, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/auth.guard.js";
import { UsersService } from "./users.service.js";
import { CurrentUser } from "../../common/decorators/user.decorator.js";
import type { User, UserRole } from "../../generated/prisma/client.js";
import { ApiResponse } from "../../common/responses/api.response.js";
import { ChangePasswordRequest, UserProfileUpdate, UserResponse } from "./dto/users.dto.js";



@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService) { }


    @Get('me')
    @HttpCode(HttpStatus.OK)
    async getMyProfile(@CurrentUser() currentUser: User): Promise<ApiResponse<UserResponse>> {
        const user = await this.usersService.getUserProfile(currentUser);
        return new ApiResponse(
            HttpStatus.OK,
            'User profile retreived successfully',
            user
        )
    }

    @Put('me')
    @HttpCode(HttpStatus.OK)
    async updateMyProfile(
        @CurrentUser() currentUser: User,
        @Body() body: UserProfileUpdate,
    ): Promise<ApiResponse<UserResponse>> {
        const user = await this.usersService.updateUserProfile(currentUser, body);
        return new ApiResponse(HttpStatus.OK, 'Profile updated successfully.', user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async listUsers(@Query('role') role?: UserRole): Promise<ApiResponse<UserResponse[]>> {
        const users = await this.usersService.getAllUsers(role);
        return new ApiResponse(HttpStatus.OK, 'Users list retrieved successfully.', users);
    }



    @Put('change-password')
    @HttpCode(HttpStatus.OK)
    async changeUserPassword(
        @CurrentUser() currentUser: User,
        @Body() body: ChangePasswordRequest,
    ): Promise<ApiResponse<null>> {
        await this.usersService.changePassword(currentUser, body);
        return new ApiResponse(HttpStatus.OK, 'Password updated successfully.', null);
    }



}