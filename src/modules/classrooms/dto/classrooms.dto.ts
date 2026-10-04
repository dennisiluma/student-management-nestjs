import { IsNotEmpty } from 'class-validator';

export class ClassroomCreate {
  @IsNotEmpty({ message: 'Classroom name is required' })
  name: string;
}

export class ClassroomUpdate {
  @IsNotEmpty({ message: 'Classroom ID is required' })
  id: number;

  @IsNotEmpty({ message: 'Classroom name is required' })
  name: string;
}

export class AssignTeacherRequest {
  @IsNotEmpty({ message: 'Classroom ID is required' })
  classroomId: number;

  @IsNotEmpty({ message: 'Teacher ID is required' })
  teacherId: number;
}

export class AddStudentToClassroomRequest {
  @IsNotEmpty({ message: 'Classroom ID is required' })
  classroomId: number;

  @IsNotEmpty({ message: 'User ID is required' })
  userId: number;
}

export class ClassroomResponse {
  id: number;
  name: string;
  teacherId?: number | null;
}