/**
 * @class BusVoltageModel
 * 
 * @summary
 * BUS VOLTAGE REGISTER: PDF REF: Figure 24 pg. 23
 * 
 * @description
 * BIT 1: Conversion ready<br />
 *  CNVR is 1 when data from conversion is available at the data registers
 *  reading the Power Register resets this to 0
 * <br /><br />
 * BIT 0: Math Overflow Flag<br />
 *  OVF is set when Power or Current calculations are out of range
 *  probably need board reset after seeing this
 */
import BaseRegisterModel from "./BaseRegisterModel.js";

class BusVoltageModel extends BaseRegisterModel {

    constructor() {
        super("BusVoltage");
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
        'BD12', 'BD11', 'BD10', 'BD9',
        'BD8', 'BD7', 'BD6', 'BD5',
        'BD4', 'BD3', 'BD2', 'BD1',
        'BD0',
        '-',
        'CNVR',
        'OVF'
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
            full: "volt",
            plural: "volts",
            short: "v"
        }
    }

    /**
     * @method BusVoltageModel#calculateValue
     * 
     * @summary
     * Takes the raw register value and formats it
     * 
     * @description
     * Calculate the Bus voltage in volts
     */
    calculateValue = function (currentValue) {
        return (currentValue >> 3) * 0.004;
    }
}

export default new BusVoltageModel();