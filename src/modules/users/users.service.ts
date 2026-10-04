import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../db/prisma.service.js';
import { NotFoundException, UnauthorizedException } from '../../common/exceptions/base.exception.js';
import { UserProfileUpdate, ChangePasswordRequest } from './dto/users.dto.js';
import { UserRole } from '../../generated/prisma/enums.js';
import { User } from '../../generated/prisma/client.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getUserProfile(currentUser: User) {
        const user = await this.prisma.user.findUnique({
            where: { id: currentUser.id },
            include: { classroom: true, results: true },
        });

        if (!user) {
            throw new NotFoundException('User record not found');
        }
        return user;
    }

    async updateUserProfile(currentUser: User, dto: UserProfileUpdate) {
        await this.prisma.user.update({
            where: { id: currentUser.id },
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                phoneNumber: dto.phoneNumber,
                bio: dto.bio,
            },
        });

        // Return fresh user with relationships loaded
        return this.prisma.user.findUnique({
            where: { id: currentUser.id },
            include: { classroom: true, results: true },
        });
    }

    async getAllUsers(role?: string | UserRole) {
        // Map incoming query string safely to Prisma's UserRole enum
        let resolvedRole: UserRole | undefined = undefined;

        if (role) {
            const roleMapping: Record<string, UserRole> = {
                admin: UserRole.ADMIN,
                teacher: UserRole.TEACHER,
                student: UserRole.STUDENT,
                ADMIN: UserRole.ADMIN,
                TEACHER: UserRole.TEACHER,
                STUDENT: UserRole.STUDENT,
            };

            resolvedRole = roleMapping[role];
        }

        return this.prisma.user.findMany({
            where: resolvedRole ? { role: resolvedRole } : undefined,
            include: {
                classroom: true,
                results: true,
            },
        });
    }

    async changePassword(currentUser: User, dto: ChangePasswordRequest) {
        const isMatch = await bcrypt.compare(dto.currentPassword, currentUser.hashedPassword);
        if (!isMatch) {
            throw new UnauthorizedException('Current password provided is incorrect.');
        }

        const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: currentUser.id },
            data: { hashedPassword: hashedNewPassword },
        });
    }
}