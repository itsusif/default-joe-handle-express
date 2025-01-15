import { Schema } from "mongoose";

declare module "express-serve-static-core" {
    interface Request {
        user: IUserRequest;
        requestId: string;
        startAt: number;
        token: string;
    }
    interface Response {
        requestId: string;
        startAt: number;
        sendSuccess: (options: {
            message: string,
            data?: any,
            status: number,
            details?: any
        }) => void;
        sendError: (options: {
            status: number,
            message: string,
            errorCode?: string,
            details?: any
        }) => void;
    }
};

export interface ErrorResponse {
    location?: string;
    msg: string;
    path?: string;
    type: string;
};

export type EntityId = string | Schema.Types.ObjectId;

export interface IUserRequest {
    _id: EntityId;
    id: string;
    isOwner: boolean;
};