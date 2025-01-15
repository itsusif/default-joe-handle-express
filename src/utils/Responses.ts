import { Response } from "express";
import { formatTime } from "./Time";
import { ErrorHandling } from "./ErrorHandling";

export const sendErrorResponse = (options: {
    status: number,
    message: string,
    errorCode?: string,
    details?: any
}) => {
    throw new ErrorHandling(
        {
            message: options.message,
            status: options.status,
            errorCode: options.errorCode,
            details: options.details
        }
    );
};

export const sendSuccessResponse = (res: Response, options: {
    message: string,
    data?: any,
    status: number,
    details?: any
}) => {
    return res
        .status(options.status)
        .json({
            statusCode: options.status,
            message: options.message,
            data: options.data || {},
            details: {
                processingTime: formatTime(Date.now() - res.startAt),
                ...(options.details || {})
            },
            timestamp: new Date().toISOString(),
            requestId: res.requestId,
            success: true
        });

};