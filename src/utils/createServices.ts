import { InfoRepository } from "@src/repository/InfoRepository";
import { InfoService } from "@src/services/InfoService";

export default class Services {
    infoService() {
        return new InfoService(
            new InfoRepository()
        );
    };
};