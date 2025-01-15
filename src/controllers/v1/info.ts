import { InfoService } from "@src/services/InfoService";
import { Response, Request, NextFunction } from "express";

export default class InfoController {
    constructor(private infoService: InfoService) { }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.infoService.getInfo(req.params.id);
            res.sendSuccess({
                status: 200,
                message: 'Info retrieved',
                data: {
                    info: data
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.infoService.createInfo(req.body.name);
            res.sendSuccess({
                status: 201,
                message: 'Info created',
                data: {
                    info: data
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedData = await this.infoService.updateInfo(req.params.id, req.body);
            res.sendSuccess({
                status: 200,
                message: 'Info updated',
                data: {
                    info: updatedData
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const dataList = await this.infoService.listInfo();

            res.sendSuccess({
                status: 200,
                message: 'Info retrieved',
                data: {
                    info: dataList
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.infoService.deleteInfo(req.params.id);

            res.sendSuccess({
                status: 200,
                message: 'Info deleted',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
};