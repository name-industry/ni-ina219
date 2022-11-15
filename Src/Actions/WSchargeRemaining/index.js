// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class WSchargeRemaining
 * 
 * @summary 
 * WSchargeRemaining Actions
 * 
 * @description 
 * Actions for the WaveShare UPS Hat 
 */

import WSchargeRemainingModel from "../../Domain/WSchargeRemaining/Model/index.js";

class WSchargeRemaining {
    constructor() { };

    getChargeRemaining = async function (busVoltage) {
        WSchargeRemainingModel.hydrate(
            busVoltage,
            "en",
            true
        );
        return WSchargeRemainingModel.getCurrentValues();
    }
}

export default new WSchargeRemaining();