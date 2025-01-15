import { Request, Response, Router } from "express";
const router = Router();

router
    .all('/', (req: Request, res: Response) => {
        res.sendSuccess({
            status: 200,
            message: 'Welcome to the API',
            data: {
                version: 'v1'
            }
        })
    });
export default router;