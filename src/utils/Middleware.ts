import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid'
import config from '@config';
import { verifyToken } from "./JWT";
import { expiredTokenModel } from "@models/ExpiredToken";
import logger from "./Logger";


// Middleware to check if the user is unauthenticated
export const unAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers['authorization'];
    if (!token) return next();

    token = token.replace('Bearer ', '');

    const decoded = verifyToken(token);
    if (decoded) {
      return res.sendError({
        status: 400,
        message: 'You are already authenticated',
        errorCode: 'already_authenticated'
      });
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if the user is authenticated
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers['authorization'];
    if (!token) {
      return res.sendError({
        status: 401,
        message: 'Unauthorized',
        errorCode: 'unauthorized'
      });
    };

    token = token.replace('Bearer ', '');

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.sendError({
        status: 401,
        message: 'Unauthorized',
        errorCode: 'unauthorized'
      });
    };

    // Check if the token is expired token
    const isExpiredToken = await expiredTokenModel.findOne({ token });
    if (isExpiredToken) {
      return res.sendError({
        status: 401,
        message: 'Unauthorized',
        errorCode: 'unauthorized'
      });
    };

    req.token = token;
    req.user = decoded;
    req.user.isOwner = config.owners.includes(decoded.id);
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if the user is authenticated
export const checkIsOwner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user.isOwner) return res.sendError({
    status: 403,
    message: 'You are not allowed to perform this action',
    errorCode: 'not_allowed'
  });

  next();
};

// Middleware to log requests and responses
export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.requestId = requestId;
  req.startAt = Date.now();

  // Log incoming request
  logger.info('Incoming Request', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      headers: sanitizeHeaders(req.headers),
      body: sanitizeBody(req.body),
      timestamp: new Date().toISOString()
  });

  // Listen for the response to finish
  res.on('finish', () => {
      const processingTime = Date.now() - (req.startAt || Date.now());
      const statusCode = res.statusCode;
      const statusMessage = res.statusMessage !== 'OK' ? res.statusMessage : null;

      // Log outgoing response
      logger.info('Outgoing Response', {
          requestId,
          statusCode,
          statusMessage,
          timestamp: new Date().toISOString(),
          processingTime
      });
  });

  next();
};

/**
* Sanitize headers to remove sensitive information.
* Adjust this function based on what headers you want to log.
* @param headers - The request headers.
* @returns Sanitized headers.
*/
const sanitizeHeaders = (headers: any): any => {
  const sanitized = { ...headers };
  // Remove sensitive headers if any
  delete sanitized['authorization'];
  delete sanitized['cookie'];
  return sanitized;
};

/**
* Sanitize body to remove sensitive information.
* Adjust this function based on what body data you want to log.
* @param body - The request body.
* @returns Sanitized body.
*/
const sanitizeBody = (body: any): any => {
  const sanitized = { ...body };
  // Remove sensitive fields if any
  if (sanitized.password) sanitized.password = '******';
  return sanitized;
};