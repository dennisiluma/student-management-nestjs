import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { ApiResponse } from "../../common/responses/api.response.js";
import { LoginRequest, LoginResponse, UserRegister } from "./dto/auth.dto.js";


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: UserRegister): Promise<ApiResponse<any>> {
        const user = await this.authService.registerUser(body);
        return new ApiResponse(
            HttpStatus.CREATED,
            'Registration successful',
            user
        )
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const res = await this.authService.loginUser(body);
        return new ApiResponse(HttpStatus.OK, 'login successfult', res)
    }


}