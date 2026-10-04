import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";


@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UsersService]
})

export class UserModule {}