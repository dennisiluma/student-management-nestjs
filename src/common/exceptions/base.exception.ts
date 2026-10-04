import { HttpException, HttpStatus } from '@nestjs/common';


export class ApiException extends HttpException {
    constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
        super({ status: statusCode, message, data: null }, statusCode);
    }
}


export class BadRequestException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InvalidCredentialsException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}