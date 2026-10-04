import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from '../../common/decorators/user.decorator.js';
import { ApiResponse } from '../../common/responses/api.response.js';
import { UserRole, type User } from '../../generated/prisma/client.js';
import { JwtAuthGuard, Roles } from "../../common/guards/auth.guard.js";
import { AcademicResultCreate, AcademicResultResponse } from "./dto/academic.dto.js";
import { AcademicService } from "./academic.service.js";



@Controller('results')
@UseGuards(JwtAuthGuard)
export class AcademicController {
    constructor(private readonly academicService: AcademicService) { }


    @Post('create')
    @Roles(UserRole.TEACHER)
    @HttpCode(HttpStatus.CREATED)
    async createAcademicResultApi(
        @Body() body: AcademicResultCreate,
    ): Promise<ApiResponse<AcademicResultResponse>> {
        const result = await this.academicService.createAcademicResult(body);
        return new ApiResponse(HttpStatus.CREATED, 'Term results created successfully.', result);
    }

    @Get('me')
    @Roles(UserRole.STUDENT)
    @HttpCode(HttpStatus.OK)
    async listMyResultsApi(
        @CurrentUser() currentUser: User,
    ): Promise<ApiResponse<AcademicResultResponse[]>> {
        const results = await this.academicService.getMyResults(currentUser.id);
        return new ApiResponse(HttpStatus.OK, 'Your academic results retrieved successfully.', results);
    }

}