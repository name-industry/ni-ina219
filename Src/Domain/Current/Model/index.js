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
import BaseRegisterModel from "../../BaseModels/BaseRegisterModel.js";
import Big from "big.js";

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
            full: "milliamp",
            plural: "milliamps",
            short: "mA"
        }
    }

    /**
    * @method CurrentModel#calculateValue
    * 
    * @summary
    * Takes the raw register value and formats it
    * +32767 and -32767
    * 
    * @description
    * Calculate the Current in amps
    */
    calculateValue = function (currentValue) {
        let calculation = currentValue * this.options.currentLSB;
        let formatted = new Big(calculation).toFixed(this.defaultPrecision);
        return {
            rawNumber: calculation,
            withPrecision: formatted
        }
    }
}

export default new CurrentModel();