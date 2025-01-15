import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''
            }`;
    })
);

const logger = createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new DailyRotateFile({
            filename: path.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(process.cwd(), 'logs', 'exceptions.log') })
    ],
    rejectionHandlers: [
        new transports.File({ filename: path.join(process.cwd(), 'logs', 'rejections.log') })
    ],
});

export default logger;