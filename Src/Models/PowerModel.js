/**
 * @class PowerModel
 * 
 * @summary
 * POWER REGISTER: PDF REF: Figure 25 pg. 23
 * 
 * @description
 * The Power register records power in watts by multiplying 
 * the values of the current with the value of the bus voltage
 */
import BaseRegisterModel from "./BaseRegisterModel.js";

class PowerModel extends BaseRegisterModel {

    constructor() {
        super("PowerVoltage");
    }

    /**
     * @type {object}
     * 
     * @summary
     * If useFullReturn is true then the labels are added to the return
     * object. 
     * 
     * @description
     * These are labels the directly match the reference sensor PDF doc. When
     * debugging or in case UI desires it, arrays of labels and bits in the 
     * register will be matched.
     */
    bitLabels = [
        'PD15', 'PD14', 'PD13', 'PD12', 'PD11', 'PD10', 'PD9',
        'PD8', 'PD7', 'PD6', 'PD5', 'PD4', 'PD3', 'PD2', 'PD1', 'PD0'
    ];

    /**
     * @type {object}
     * 
     * @summary
     * the type of value in the register
     * 
     * @description
     * Currently only english language value types
     */
    measurement = {
        en: {
            full: "watt",
            plural: "watts",
            short: "w"
        }
    }

    /**
    * @method PowerModel#calculateValue
    * 
    * @summary
    * Takes the raw register value and formats it
    * 
    * @description
    * Calculate the Power in volts
    */
    calculateValue = function (currentValue) {
        return currentValue * 0.002; // TODO: -> this.currentConfiguration.powerLSB;
    }
}

export default new PowerModel();