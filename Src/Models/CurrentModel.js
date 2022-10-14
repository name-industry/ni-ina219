/**
 * @class CurrentModel
 * 
 * @summary
 * CURRENT REGISTER: PDF REF: Figure 26 pg. 23
 * 
 * @description
 * The value of the Current register is calculated by multiplying 
 * the value in the Shunt Voltage register with the value in 
 * the Calibration register
 */
import BaseRegisterModel from "./BaseRegisterModel.js";

class CurrentModel extends BaseRegisterModel {

    constructor() {
        super("Current");
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
        'CSIGN',
        'CD14', 'CD13', 'CD12', 'CD11', 'CD10', 'CD9', 'CD8', 'CD7', 'CD6',
        'CD5', 'CD4', 'CD3', 'CD2', 'CD1', 'CD0'
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
            full: "amp",
            plural: "amps",
            short: "a"
        }
    }

    /**
    * @method CurrentModel#calculateValue
    * 
    * @summary
    * Takes the raw register value and formats it
    * 
    * @description
    * 
    */
    calculateValue = function (currentValue) {
        return currentValue * 0.1 / 1000; // TODO: -> this.currentConfiguration.currentLSB;
    }
}

export default new CurrentModel();