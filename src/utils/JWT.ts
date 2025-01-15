import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET as string;

export const generateToken = (payload: any, expiresIn: string = '720h') => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secretKey) as any;
    } catch (error) {
        return null;
    }
};