import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { ErrorHandling } from '@utils/ErrorHandling';
import { logMiddleware } from '@utils/Middleware';
import fs from 'node:fs';

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.set('trust proxy', 1);
// Setup res.success and res.error
app.use((req: Request, res: Response, next: NextFunction) => {
    res.startAt = Date.now();
    req.startAt = Date.now();

    res.sendSuccess = (options: any) => sendSuccessResponse(res, options);
    res.sendError = (options: any) => sendErrorResponse(options);
    next();
});

// Middleware to assign a unique ID to each request and log it
app.use(logMiddleware);

// Database
import '@database/index';

const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'access.log'), { flags: 'a' });

// Middleware
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

app.use(bodyParser.json({
    limit: '50mb'
})); // Parsing application/json
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); // Parsing application/x-www-form-urlencoded
app.use(cookieParser()); // Parsing cookies
app.use(helmet()); // Security headers
app.use(compression()); // Compression of responses
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
import apiRoute from '@router/v1/index';
import { formatTime } from '@utils/Time';
import { sendErrorResponse, sendSuccessResponse } from '@utils/Responses';
import logger from '@utils/Logger';

app.use('/api/v1', apiRoute);

// Error handling middleware
app.use((err: ErrorHandling, req: Request, res: Response, next: NextFunction) => {
    try {

        logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    } catch { }

    return res
        .status(err.status || 500)
        .json({
            success: false,
            statusCode: err.status || 500,
            message: err.message || 'Internal Server Error',
            errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
            details: {
                processingTime: formatTime(Date.now() - req.startAt),
                ...(err.details || {})
            },
            timestamp: new Date().toISOString(),
            requestId: req.requestId,
        });
});

// 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
    try {
        logger.error(`404 - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    } catch { }

    return res
        .status(404)
        .json({
            statusCode: 404,
            message: 'Not Found',
            errorCode: "NOT_FOUND",
            details: {
                processingTime: formatTime(Date.now() - req.startAt)
            },
            timestamp: new Date().toISOString(),
            requestId: req.requestId,
            success: false
        });
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3333;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('uncaughtExceptionMonitor', (e) => {
})

process.on('uncaughtException', (e) => {
});

process.on('unhandledRejection', (e) => {
});