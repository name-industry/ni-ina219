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
import Big from 'big.js';

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
            short: "V"
        }
    }

    /**
     * @method BusVoltageModel#calculateValue
     * 
     * @summary
     * Get the Bus voltage. Takes the raw register value and formats it
     * 
     * @description
     * Calculates the Bus voltage in volts
     * The BusVoltage is set with the configuration register to be 
     * either 16v or 32v this means the Full Scale Range to try and 
     * store in bits 15 -> 3
     *  
     * Bus voltage LSB is 4mV at both 32V and 16V settings.
     * 
     * see pg 23 in PDF of ina219, 8.6.3.2 Bus Voltage Register (address = 02h)
     * 
     * Note: the register value is shifted 3 bits to the left
     * bit 2 '-',
     * bit 1 'CNVR',
     * bit 0 'OVF'
     * 
     * TODO: Check if value is correct via bit 0
     * POST-IT: Need to play with with this to see what if anything changes
     * internally when it captures the bus voltage.
     * 
     * @param {number} currentValue the current measurement in the register 
     * 
     * @returns {object} returns calculated values
     */
    calculateValue = function (currentValue) {
        // get bits 15 to 3
        let shifted = currentValue >> 3;
        // multiply by 4mV per bit
        let calculation = shifted * 0.004;
        let formatted = new Big(calculation).toFixed(this.defaultPrecision);
        return {
            rawNumber: calculation,
            withPrecision: formatted
        }
    }
}

export default new BusVoltageModel();