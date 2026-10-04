import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SecurityJwtService } from "./security.service.js";



@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.SECRETE_JWT_KEY,
            signOptions: {
                expiresIn: (process.env.ACCESS_TOKEN_EXPIRE_DAYS || '30') + 'd' as any
            }
        }),
    ],

    providers: [SecurityJwtService],
    exports: [SecurityJwtService, JwtModule],
})

export class SecurityJwtModule { }