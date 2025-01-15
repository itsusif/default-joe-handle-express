export class ErrorHandling extends Error {
    status: number;
    errorCode?: string;
    details?: any;

    constructor(options: { message: string, status: number, errorCode?: string, details?: any }) {
        super(options.message);
        this.name = this.constructor.name;
        this.status = options.status;
        this.errorCode = options.errorCode;
        this.details = options.details;
    };
};