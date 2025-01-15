import { Router } from "express";
import { authMiddleware, checkIsOwner } from "@utils/Middleware";
const router = Router();

import InfoController from "@controllers/v1/info";
import Services from "@utils/createServices";

const services = new Services();

const Info = new InfoController(services.infoService());


router
    .route('/')
    .get(authMiddleware, Info.list)
    .post(authMiddleware, Info.create);

router
    .route('/:id')
    .get(authMiddleware, Info.get)
    .put(authMiddleware, checkIsOwner, Info.update)
    .delete(authMiddleware, checkIsOwner, Info.delete);

export default router;