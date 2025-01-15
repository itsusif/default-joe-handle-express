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

// Routes
import infoRoute from '@router/v1/info';

router.use('/info', infoRoute);

export default router;