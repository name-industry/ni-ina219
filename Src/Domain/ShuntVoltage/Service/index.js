
import I2CBus from "../../../Bus/I2C/index.js";
import { REGISTERS } from "../../../Constants/index.js";

class ShuntVoltageService {

    constructor() {};

    readRegister = async function () {
        return await I2CBus.readRegister(REGISTERS.SHUNT_VOLTAGE_R);
    }

}

export default new ShuntVoltageService();