import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, Roles } from "../../common/guards/auth.guard.js";
import { ClassroomsService } from "./classrooms.service.js";
import { AddStudentToClassroomRequest, AssignTeacherRequest, ClassroomCreate, ClassroomResponse, ClassroomUpdate } from "./dto/classrooms.dto.js";
import { ApiResponse } from "../../common/responses/api.response.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { CurrentUser } from "../../common/decorators/user.decorator.js";
import type { User } from "../../generated/prisma/client.js";
import { UserResponse } from "../users/dto/users.dto.js";


@Controller('classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomsController {
    constructor(private readonly classroomsService: ClassroomsService) { }


    @Post()
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async createClassroom(@Body() body: ClassroomCreate): Promise<ApiResponse<ClassroomResponse>> {
        const classroom = await this.classroomsService.createClassroom(body);
        return new ApiResponse(HttpStatus.CREATED, 'Classroom created successfully', classroom)
    }


    @Put()
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async editClassroom(@Body() body: ClassroomUpdate): Promise<ApiResponse<ClassroomResponse>> {
        const classroom = await this.classroomsService.updateClassroom(body);
        return new ApiResponse(HttpStatus.CREATED, 'Classroom updated successfully', classroom)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllClassrooms(): Promise<ApiResponse<ClassroomResponse[]>> {
        const classrooms = await this.classroomsService.getClassrooms();
        return new ApiResponse(HttpStatus.OK, 'Classrooms retrieved successfully.', classrooms);
    }

    @Post('assign-teacher')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async assignTeacher(@Body() body: AssignTeacherRequest): Promise<ApiResponse<ClassroomResponse>> {
        const classroom = await this.classroomsService.assignTeacherToClassroom(body.classroomId, body.teacherId);
        return new ApiResponse(HttpStatus.OK, 'Teacher assigned to classroom successfully.', classroom);
    }


    @Post('assign-student')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async assignStudentAClassroom(@Body() body: AddStudentToClassroomRequest): Promise<ApiResponse<UserResponse>> {
        const user = await this.classroomsService.assignStudentToClassroom(body);
        return new ApiResponse(HttpStatus.OK, 'Student assigned to classroom successfully.', user);
    }

    @Get('my-students')
    @Roles(UserRole.TEACHER)
    @HttpCode(HttpStatus.OK)
    async getMyStudents(@CurrentUser() currentUser: User): Promise<ApiResponse<UserResponse[]>> {
        const students = await this.classroomsService.getMyStudents(currentUser.id);
        return new ApiResponse(HttpStatus.OK, "Teacher's students retrieved successfully.", students);
    }

    @Get('my-classmates')
    @Roles(UserRole.STUDENT)
    @HttpCode(HttpStatus.OK)
    async getMyClassmatesData(@CurrentUser() currentUser: User): Promise<ApiResponse<UserResponse[]>> {
        const classmates = await this.classroomsService.getMyClassmates(currentUser);
        return new ApiResponse(HttpStatus.OK, 'Classmates retrieved successfully.', classmates);
    }


}