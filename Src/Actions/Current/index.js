// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class Current
 * 
 * @summary 
 * Current Actions
 * 
 * @description 
 * Actions for the Current register on the INA219 
 */

import CurrentModel from "../../Domain/Current/Model/index.js";
import CurrentService from "../../Domain/Current/Service/index.js";


class Current {
    constructor() { };

    getCurrent = async function (currentLSB) {
        let readResult = await CurrentService.readRegister();
        if (readResult.success === true) {
            CurrentModel.hydrate(readResult.data, "en", true, {
                currentLSB: currentLSB
            });
            return CurrentModel.getCurrentValues();
        } else {
            return readResult;
        }
    }
}

export default new Current();