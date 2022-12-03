
import I2CBus from "../../../Bus/I2C/index.js";
import Calibration from "../../../Actions/Calibration/index.js";
import { REGISTERS } from "../../../Constants/index.js";

class CurrentService {

    constructor() {};

    readRegister = async function () {
        // call calibration in case or edge case issues
        await Calibration.triggerCalibration();
        return await I2CBus.readRegister(REGISTERS.CURRENT_R);
    }

}

export default new CurrentService();