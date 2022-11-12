/**
 * @class CalibrationModel
 * 
 * @summary
 * CALIBRATION REGISTER: PDF REF: Figure 27 pg. 24
 * @description
 * Current and Power calibration settings. 
 * <br /><br />
 * BIT 0: void<br />
 *  this bit is not used and cant be set.
 * <br /><br />
 * BIT 15 - 1: settings<br />
 *  Full scale range, LSB or current and power, and overall system calibration
 */

import BaseRegisterModel from "./BaseRegisterModel.js";
import { Constants } from "../Constants/index.js";

class CalibrationModel extends BaseRegisterModel {

    /** @type {number} */
    currentLSB = 0;
    
    /** @type {number} */
    powerLSB = 0;

    /** @type {number} */
    calculationValue = 0;

    constructor() {
        super("Calibration");
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
        'FS15', 'FS14', 'FS13', 'FS12', 'FS11', 'FS10',
        'FS9', 'FS8', 'FS7', 'FS6', 'FS5', 'FS4', 'FS3',
        'FS2', 'FS1', 'FS0'
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
        en: {}
    }

    /**
     * @method CalibrationModel#setCalibrationValues
     * 
     * @summary
     * EXPERIMENTAL: calculate system calc values
     * 
     * @description
     * Expose shunt value and calculation values to tune
     * system measurements.
     * 
     * @param {number} busVoltageMax 
     * @param {number} shuntResistanceOhms 
     * @param {number} gainVoltage 
     * @param {number} currentMaxExpected 
     */
    setCalibrationValues = function (
        busVoltageMax,
        shuntResistanceOhms,
        gainVoltage,
        currentMaxExpected
    ) {

        // BUS_VOLTAGE_RANGE as Volts
        // RANGE_16V || RANGE_32V
        // 16 || 32
        // - busVoltageMax;

        // SHUNT_VALUE as OHMS passed in by hand not in config
        // 0.1
        // - shuntResistanceOhms;

        // GAIN as Volts
        // DIV_1_40MV || DIV_2_80MV || DIV_4_160MV || DIV_8_320MV
        // 0.04 || 0.08 || 0.16 || 0.32
        // - gainVoltage

        // Maximum current calc
        let currentMax = gainVoltage / shuntResistanceOhms;

        // Minimum LSB 15 bits 
        // results in uA per bit
        let minimumLSB = currentMaxExpected / Math.pow(2, 15);

        // Maximum LSB 12 bit
        // results in uA per bit
        let maximumLSB = currentMaxExpected / Math.pow(2, 12);

        // page 12 in the ina219 pdf "8.5.1 Programming the Calibration Register"
        // ...While this value yields the highest resolution, 
        // it is common to select a value for the Current_LSB to 
        // the nearest round number above this value to simplify the 
        // conversion of the Current Register (04h) and 
        // Power Register (03h) to amperes and watts respectively

        // I am not rounding it here. 1 way to round it is look at
        // maximumLSB and round up
        let currentLSB = currentMaxExpected / Math.pow(2, 15);

        // trunc prior to assign
        // #note: 0.04096 is an internal fixed value in ina219
        let calculationValue = 0.04096 / (currentLSB * shuntResistanceOhms);

        // 20 is an internal fixed value in ina219
        let powerLSB = currentLSB * 20;

        // update internal values
        this.currentLSB = currentLSB;
        this.powerLSB = powerLSB;
        this.calculationValue = calculationValue;

        // send back results in case needed
        return {
            currentLSB,
            powerLSB,
            calculationValue
        }

    }

}

export default new CalibrationModel();