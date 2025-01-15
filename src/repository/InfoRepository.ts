import { EntityId } from "@type/index";

export interface InfoModel {
    id: EntityId;
    name: string;
}

export class InfoRepository {
    private data: InfoModel[] = [
        {
            id: "1",
            name: "Info 1",
        },
        {
            id: "2",
            name: "Info 2",
        },
        {
            id: "3",
            name: "Info 3",
        }
    ];

    async getInfoById(id: EntityId): Promise<InfoModel | null> {
        try {
            const info = this.data.find(item => item.id === id);
            return info || null;
        } catch (error) {
            console.error("Error getting info by ID:", error);
            throw error;
        }
    };

    async createInfo(data: Partial<InfoModel>): Promise<InfoModel> {
        try {
            const newInfo: InfoModel = { id: data.id, ...data } as InfoModel;
            this.data.push(newInfo);
            return newInfo;
        } catch (error) {
            console.error("Error creating info:", error);
            throw error;
        }
    };

    async findInfo(): Promise<InfoModel[]> {
        try {
            return this.data;
        } catch (error) {
            console.error("Error finding info:", error);
            throw error;
        }
    };
    
    async updateInfo(id: EntityId, data: Partial<InfoModel>): Promise<InfoModel> {
        try {
            const index = this.data.findIndex(item => item.id === id);
            if (index === -1) {
                throw new Error("Info not found");
            }
            this.data[index] = { ...this.data[index], ...data } as InfoModel;
            return this.data[index];
        } catch (error) {
            console.error("Error updating info:", error);
            throw error;
        }
    };

    async deleteInfo(id: EntityId): Promise<void> {
        try {
            const index = this.data.findIndex(item => item.id === id);
            if (index === -1) {
                throw new Error("Info not found");
            }
            this.data.splice(index, 1);
        } catch (error) {
            console.error("Error deleting info:", error);
            throw error;
        }
    };
}