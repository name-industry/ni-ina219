
import I2CBus from "../../../Bus/I2C/index.js";
import { REGISTERS } from "../../../Constants/index.js";

class CurrentService {

    constructor() {};

    readRegister = async function () {
        return await I2CBus.readRegister(REGISTERS.CURRENT_R);
    }

}

export default new CurrentService();