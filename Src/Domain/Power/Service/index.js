
import I2CBus from "../../../Bus/I2C/index.js";
import { REGISTERS } from "../../../Constants/index.js";

class PowerService {

    constructor() {};

    readRegister = async function () {
        return await I2CBus.readRegister(REGISTERS.POWER_R);
    }

}

export default new PowerService();