
import I2CBus from "../../../Bus/I2C/index.js";
import { REGISTERS } from "../../../Constants/index.js";

class ConfigurationService {

    constructor() {};

    readRegister = async function () {
        return await I2CBus.readRegister(REGISTERS.CONFIG_RW);
    }

    writeRegister = async function (value) {
        return await I2CBus.writeRegister(REGISTERS.CONFIG_RW, value);
    }

}

export default new ConfigurationService();