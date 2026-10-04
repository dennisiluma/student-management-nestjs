import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../db/prisma.service.js";
import { SecurityJwtService } from "../../common/security/security.service.js";
import { LoginRequest, LoginResponse, UserRegister } from "./dto/auth.dto.js";
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from "../../common/exceptions/base.exception.js";
import * as bcrypt from 'bcrypt'
import { UserRole } from "../../generated/prisma/enums.js";


@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: SecurityJwtService,
    ) { }


    async registerUser(dto: UserRegister): Promise<any> {

        const email = dto.email.toLowerCase().trim();

        const existing = await this.prisma.user.findUnique({ where: { email } });

        if (existing) {
            throw new BadRequestException('User with this enail address already exists')
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Map incoming string/enum safely to Prisma's expected enum type
        const roleMapping: Record<string, UserRole> = {
            admin: UserRole.ADMIN,
            teacher: UserRole.TEACHER,
            student: UserRole.STUDENT,
            ADMIN: UserRole.ADMIN,
            TEACHER: UserRole.TEACHER,
            STUDENT: UserRole.STUDENT,
        };

        const resolvedRole = roleMapping[dto.role] ?? UserRole.STUDENT


        const user = await this.prisma.user.create({
            data: {
                email,
                hashedPassword,
                role: resolvedRole,
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
        });

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber ?? null,
        };
    }



    async loginUser(dto: LoginRequest): Promise<LoginResponse> {

        const email = dto.email.toLowerCase().trim();
        const user = await this.prisma.user.findUnique({ where: { email } });


        if (!user) {
            throw new NotFoundException(`Account not found for email: ${email}`);
        }


        const isPasswordValid = await bcrypt.compare(dto.password, user.hashedPassword);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password provided');
        }

        if (!user.isActive) {
            throw new ForbiddenException('User account is inactive. Please contact support');
        }


        const token = this.jwtService.generateToken({ sub: user.email, role: user.role, id: user.id });


        return {
            token,
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };

    }

}