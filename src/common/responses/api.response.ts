

export class ApiResponse<T> {
    status: number;
    message: string;
    data: T | null;


    constructor(status: number, message: string, data: T | null = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}