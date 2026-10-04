import { Module } from "@nestjs/common";
import { AcademicController } from "./academic.controller.js";
import { AcademicService } from "./academic.service.js";


@Module({
    imports: [],
    controllers: [AcademicController],
    providers: [AcademicService]
})

export class AcademicModule {}