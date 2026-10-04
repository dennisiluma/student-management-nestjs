import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from "../exceptions/base.exception.js";



@Injectable()
export class SecurityJwtService {
    constructor(private readonly jwtService: JwtService) { }

    generateToken(payload: Object, expiresIn: string = '30d'): string {

        return this.jwtService.sign(payload, {
            secret: process.env.SECRETE_JWT_KEY,
            expiresIn: expiresIn as any
        });
    }

    verifyToken(token: string): any {
        try {

            return this.jwtService.verify(token, {
                secret: process.env.SECRETE_JWT_KEY
            });
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            throw new UnauthorizedException('Invalid token or credentials');
        }
    }


}