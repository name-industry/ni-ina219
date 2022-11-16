// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class BusVoltage
 * 
 * @summary 
 * BusVoltage Actions
 * 
 * @description 
 * Actions for the Bus Voltage register on the INA219 
 */

import BusVoltageModel from "../../Domain/BusVoltage/Model/index.js";
import BusVoltageService from "../../Domain/BusVoltage/Service/index.js";


class BusVoltage {
    constructor() { };

    getBusVoltage = async function () {
        let readResult = await BusVoltageService.readRegister();
        if (readResult.success === true) {
            BusVoltageModel.hydrate(readResult.data, "en", true);
            return {
                success: true,
                msg: "Bus Voltage",
                data: BusVoltageModel.getCurrentValues()
            }
        } else {
            return readResult;
        }
    }
}

export default new BusVoltage();