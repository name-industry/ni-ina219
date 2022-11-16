// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class WSpowerSupplyVoltage
 * 
 * @summary 
 * WSpowerSupplyVoltage Actions
 * 
 * @description 
 * Actions for the WaveShare UPS Hat  
 */

import WSpowerSupplyVoltageModel from "../../Domain/WSpowerSupplyVoltage/Model/index.js";

class WSpowerSupplyVoltage {
    constructor() { };

    getPSUVoltage = async function (busVoltage, shuntVoltage) {

        WSpowerSupplyVoltageModel.hydrate(
            {
                busVoltage: busVoltage,
                shuntVoltage: shuntVoltage
            },
            "en",
            true
        );
        return {
            success: true,
            msg: "PowerSupplyVoltage",
            data: WSpowerSupplyVoltageModel.getCurrentValues()
        }
    }
}

export default new WSpowerSupplyVoltage();