
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SecurityJwtService } from '../security/security.service.js';
import { PrismaService } from '../../db/prisma.service.js';
import { UnauthorizedException, ForbiddenException } from '../exceptions/base.exception.js';
import { UserRole } from '../../generated/prisma/enums.js';


/**
 * JwtAuthGuard
 * 
 * A custom NestJS guard that protects routes by:
 * 1. Extracting and validating the JWT Bearer token from the request header.
 * 2. Fetching the corresponding user from the database via Prisma.
 * 3. Checking if the user account is active.
 * 4. Enforcing optional role-based access control (RBAC).
 * 5. Attaching the verified user object to the request for downstream controllers.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: SecurityJwtService,
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector,
    ) { }

    /**
     * Determines whether the current request is allowed to proceed.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // ---------------------------------------------------------------------------
        // Step 1: Check for role-based metadata on the handler or controller class
        // ---------------------------------------------------------------------------
        const requiredRole = this.reflector.getAllAndOverride<UserRole>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        // ---------------------------------------------------------------------------
        // Step 2: Extract and validate the Authorization header
        // ---------------------------------------------------------------------------
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authentication token missing or malformed');
        }

        // ---------------------------------------------------------------------------
        // Step 3: Parse token and verify its payload
        // ---------------------------------------------------------------------------
        const token = authHeader.split(' ')[1];
        const payload = this.jwtService.verifyToken(token);

        if (!payload || !payload.sub) {
            throw new UnauthorizedException('Invalid or expired token payload');
        }

        // ---------------------------------------------------------------------------
        // Step 4: Query the database to ensure the user still exists and is active
        // ---------------------------------------------------------------------------
        const user = await this.prisma.user.findUnique({
            where: { email: payload.sub },
            include: { classroom: true, results: true },
        });

        if (!user) {
            throw new UnauthorizedException('User belonging to this token no longer exists');
        }

        if (!user.isActive) {
            throw new ForbiddenException('Account is deactivated');
        }

        // ---------------------------------------------------------------------------
        // Step 5: Enforce role-based authorization (if a role is required)
        // ---------------------------------------------------------------------------
        if (requiredRole && user.role !== requiredRole) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        // ---------------------------------------------------------------------------
        // Step 6: Attach user object to request and allow access
        // ---------------------------------------------------------------------------
        request.user = user;
        return true;
    }
}



/**
 * Inline decorator to restrict route access to a specific user role.
 * Usage: @Roles(UserRole.ADMIN)
 */
export const Roles = (role: UserRole) => SetMetadata('role', role);



