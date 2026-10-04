import { Module } from "@nestjs/common";
import { ClassroomsController } from "./classrooms.controller.js";
import { ClassroomsService } from "./classrooms.service.js";


@Module({
    imports: [],
    controllers: [ClassroomsController],
    providers: [ClassroomsService]
})

export class ClassroomModule {}