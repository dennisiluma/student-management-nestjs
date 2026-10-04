import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service.js';
import { BadRequestException, NotFoundException } from '../../common/exceptions/base.exception.js';
import { ClassroomCreate, ClassroomUpdate, AddStudentToClassroomRequest } from './dto/classrooms.dto.js';
import { UserRole } from '../../generated/prisma/enums.js';
import type { User, Classroom } from '../../generated/prisma/client.js';

@Injectable()
export class ClassroomsService {

    constructor(private readonly prisma: PrismaService) { }

    async createClassroom(dto: ClassroomCreate): Promise<Classroom> {
        const existing = await this.prisma.classroom.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new BadRequestException(`Classroom with name '${dto.name}' already exists.`);
        }

        return this.prisma.classroom.create({
            data: { name: dto.name },
        });
    }

    async updateClassroom(dto: ClassroomUpdate): Promise<Classroom> {
        const classroom = await this.prisma.classroom.findUnique({
            where: { id: dto.id },
        });
        if (!classroom) {
            throw new NotFoundException('Classroom not found.');
        }

        const duplicate = await this.prisma.classroom.findFirst({
            where: { name: dto.name, NOT: { id: dto.id } },
        });
        if (duplicate) {
            throw new BadRequestException(`Classroom with name '${dto.name}' already exists.`);
        }

        return this.prisma.classroom.update({
            where: { id: dto.id },
            data: { name: dto.name },
        });
    }

    async getClassrooms(): Promise<Classroom[]> {
        const classrooms = await this.prisma.classroom.findMany();
        if (!classrooms.length) {
            throw new NotFoundException('No classrooms found');
        }
        return classrooms;
    }

    async assignTeacherToClassroom(classroomId: number, teacherId: number): Promise<Classroom> {
        const teacher = await this.prisma.user.findUnique({ where: { id: teacherId } });
        if (!teacher || teacher.role !== UserRole.TEACHER) {
            throw new BadRequestException('User must be a valid teacher.');
        }

        const targetClassroom = await this.prisma.classroom.findUnique({ where: { id: classroomId } });
        if (!targetClassroom) {
            throw new NotFoundException('Target classroom not found.');
        }

        // Unassign teacher from any previous classrooms, then assign to target
        await this.prisma.classroom.updateMany({
            where: { teacherId },
            data: { teacherId: null },
        });

        return this.prisma.classroom.update({
            where: { id: classroomId },
            data: { teacherId },
        });
    }

    async assignStudentToClassroom(body: AddStudentToClassroomRequest): Promise<User> {
        const student = await this.prisma.user.findUnique({ where: { id: body.userId } });
        if (!student || student.role !== UserRole.STUDENT) {
            throw new NotFoundException('Student record not found');
        }

        const classroom = await this.prisma.classroom.findUnique({ where: { id: body.classroomId } });
        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        return this.prisma.user.update({
            where: { id: body.userId },
            data: { classroomId: body.classroomId },
            include: { classroom: true, results: true },
        });
    }

    async getMyStudents(teacherId: number): Promise<User[]> {
        const classroom = await this.prisma.classroom.findFirst({
            where: { teacherId },
            include: { students: { include: { classroom: true, results: true } } },
        });

        if (!classroom) {
            return [];
        }

        return classroom.students;
    }



    async getMyClassmates(currentUser: User): Promise<User[]> {
        if (!currentUser.classroomId) {
            throw new NotFoundException('You are not currently enrolled in any classroom.');
        }

        return this.prisma.user.findMany({
            where: {
                classroomId: currentUser.classroomId,
                NOT: { id: currentUser.id },
            },
            include: { classroom: true, results: true },
        });
    }
}