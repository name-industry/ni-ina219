// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class Power
 * 
 * @summary 
 * Power Actions
 * 
 * @description 
 * Actions for the Power register on the INA219 
 */

import PowerModel from "../../Domain/Power/Model/index.js";
import PowerService from "../../Domain/Power/Service/index.js";


class Power {
    constructor() { };

    getPower = async function (powerLSB) {
        let readResult = await PowerService.readRegister();
        if (readResult.success === true) {
            PowerModel.hydrate(readResult.data, "en", true, {
                powerLSB: powerLSB
            });
            return {
                success: true,
                msg: "Power",
                data: PowerModel.getCurrentValues()
            }
        } else {
            return readResult;
        }
    }
}

export default new Power();