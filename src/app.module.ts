import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SecurityJwtModule } from './common/security/security.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PrismaModule } from './db/prisma.module.js';
import { UserModule } from './modules/users/users.module.js';
import { ClassroomModule } from './modules/classrooms/classrooms.module.js';
import { AcademicModule } from './modules/academics/academic.module.js';

@Module({
  imports: [
    PrismaModule,
    SecurityJwtModule,
    AuthModule,
    UserModule,
    ClassroomModule,
    AcademicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
