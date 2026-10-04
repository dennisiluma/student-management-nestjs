import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from 'express';



@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();


        const message =
            typeof exceptionResponse === 'object' && exceptionResponse !== null
                ? exceptionResponse.message || exception.message
                : exception.message;


        response.status(status).json({
            status: status,
            message: Array.isArray(message) ? message[0] : message,
            data: null,
        });
    }
}