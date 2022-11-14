
import I2CBus from "../../../Bus/I2C/index.js";
import { REGISTERS } from "../../../Constants/index.js";

class CalibrationService {

    constructor() {};

    readRegister = async function () {
        return await I2CBus.readRegister(REGISTERS.CALIBRATION_RW);
    }

    writeRegister = async function (value) {
        return await I2CBus.writeRegister(REGISTERS.CALIBRATION_RW, value);
    }

}

export default new CalibrationService();