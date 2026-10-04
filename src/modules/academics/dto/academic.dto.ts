import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { GradeTerm } from '../../../generated/prisma/enums.js';

export class AcademicResultCreate {
    @IsNumber({}, { message: 'Student ID must be a number' })
    @IsNotEmpty({ message: 'Student ID is required' })
    studentId: number;

    @IsEnum(GradeTerm, { message: 'Invalid grade term specified' })
    @IsNotEmpty({ message: 'Term is required' })
    term: GradeTerm;

    @IsString()
    @IsNotEmpty({ message: 'Academic year is required' })
    academicYear: string;

    @IsObject({ message: 'Grades must be a valid key-value object' })
    @IsNotEmpty({ message: 'Grades are required' })
    grades: Record<string, string>; // e.g., { Maths: "A", English: "B" }
}

export class AcademicResultResponse {
    id: number;
    studentId: number;
    term: GradeTerm;
    academicYear: string;
    grades: Record<string, string>;
}