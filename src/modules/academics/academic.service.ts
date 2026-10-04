import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service.js';
import { BadRequestException, NotFoundException } from '../../common/exceptions/base.exception.js';
import { GradeTerm, UserRole } from '../../generated/prisma/enums.js';
import { AcademicResultCreate } from './dto/academic.dto.js';


@Injectable()
export class AcademicService {

    constructor(private readonly prisma: PrismaService) { }


    private mapGradeTerm(term: string | GradeTerm): GradeTerm {
        const termMapping: Record<string, GradeTerm> = {
            '1st Term': GradeTerm.FIRST_TERM,
            'FIRST_TERM': GradeTerm.FIRST_TERM,
            'first-term': GradeTerm.FIRST_TERM,
            '2nd Term': GradeTerm.SECOND_TERM,
            'SECOND_TERM': GradeTerm.SECOND_TERM,
            'second-term': GradeTerm.SECOND_TERM,
            '3rd Term': GradeTerm.THIRD_TERM,
            'THIRD_TERM': GradeTerm.THIRD_TERM,
            'third-term': GradeTerm.THIRD_TERM,
        };

        // Fallback if it's already a valid enum value match
        if (Object.values(GradeTerm).includes(term as GradeTerm)) {
            return term as GradeTerm;
        }

        return termMapping[term] ?? GradeTerm.FIRST_TERM;
    }



    async createAcademicResult(dto: AcademicResultCreate): Promise<any> {
        const student = await this.prisma.user.findUnique({
            where: { id: dto.studentId },
        });

        if (!student) {
            throw new NotFoundException('User not found');
        }

        if (student.role !== UserRole.STUDENT) {
            throw new BadRequestException('User is not a student');
        }

        const resolvedTerm = this.mapGradeTerm(dto.term);

        const existingResult = await this.prisma.academicResult.findFirst({
            where: {
                studentId: dto.studentId,
                term: resolvedTerm,
                academicYear: dto.academicYear,
            },
        });

        let result;
        if (existingResult) {
            result = await this.prisma.academicResult.update({
                where: { id: existingResult.id },
                data: { grades: dto.grades },
            });
        } else {
            result = await this.prisma.academicResult.create({
                data: {
                    studentId: dto.studentId,
                    term: resolvedTerm,
                    academicYear: dto.academicYear,
                    grades: dto.grades,
                },
            });
        }

        return {
            ...result,
            grades: result.grades as Record<string, string>,
        };
    }

    async getMyResults(studentId: number): Promise<any[]> {
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            throw new NotFoundException('Student record not found');
        }

        const results = await this.prisma.academicResult.findMany({
            where: { studentId },
        });

        return results.map((res) => ({
            ...res,
            grades: res.grades as Record<string, string>,
        }));
    }

}