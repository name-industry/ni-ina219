
import I2CBus from "../../../Bus/I2C/index.js";
import { REGISTERS } from "../../../Constants/index.js";

class BusVoltageService {

    constructor() {};

    readRegister = async function () {
        return await I2CBus.readRegister(REGISTERS.BUS_VOLTAGE_R);
    }

}

export default new BusVoltageService();