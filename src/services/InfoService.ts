import logger from '@utils/Logger';
import { InfoRepository, InfoModel } from '@src/repository/InfoRepository';

export class InfoService {
    constructor(
        private readonly infoRepository: InfoRepository
    ) { }

    async getInfo(id: string) {
        try {
            const info = await this.infoRepository.getInfoById(id);
            return info;
        } catch (error) {
            logger.error('Error getting info', error);
            throw error;
        }
    }

    async createInfo(name: string) {
        try {
            const id = Math.random().toString(36).substring(7);
            const newInfo = await this.infoRepository.createInfo({
                id,
                name
            });
            return newInfo;
        } catch (error) {
            logger.error('Error creating info', error);
            throw error;
        }
    }

    async updateInfo(id: string, data: any) {
        try {
            const updatedInfo = await this.infoRepository.updateInfo(id, data);
            return updatedInfo;
        } catch (error) {
            logger.error('Error updating info', error);
            throw error;
        }
    }

    async listInfo() {
        try {
            const infoList = await this.infoRepository.findInfo();
            return infoList;
        } catch (error) {
            logger.error('Error listing info', error);
            throw error;
        }
    }

    async deleteInfo(id: string) {
        try {
            await this.infoRepository.deleteInfo(id);
        } catch (error) {
            logger.error('Error deleting info', error);
            throw error;
        }
    }

};