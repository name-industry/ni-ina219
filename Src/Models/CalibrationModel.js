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
import Big from "big.js";

class CalibrationModel extends BaseRegisterModel {

    /** @type {number} */
    currentLSB = 0;

    /** @type {number} */
    currentLSB_R = 0;

    /** @type {number} */
    powerLSB = 0;

    /** @type {number} */
    calculationValue = 0;

    /** @type {number} */
    calculationValue_R = 0;

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
     * @method CalibrationModel#setCustomCalibrationValues
     * 
     * @summary
     * EXPERIMENTAL: calculate system calc values
     * 
     * @description
     * Expose shunt value and calculation values to tune
     * system measurements.
     * 
     * @returns {Object} returns calibration values
     */
    getCalibrationValues = function () {
        return {
            currentLSB: this.currentLSB,
            currentLSB_R: this.currentLSB_R,
            powerLSB: this.powerLSB,
            calculationValue: this.calculationValue,
            calculationValue_R: this.calculationValue_R
        }
    }

    /**
     * @method CalibrationModel#setCustomCalibrationValues
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
     * 
     * @returns {Object} returns calibration values
     */
    setCustomCalibrationValues = function (
        busVoltageMax,
        shuntResistanceOhms,
        gainVoltage,
        currentMaxExpected
    ) {

        // Convert all values to High Resolution Big-Js number objects;
        let gainVoltageHR = new Big(gainVoltage);
        let shuntResistanceOhmsHR = new Big(shuntResistanceOhms);
        let currentMaxExpectedHR = new Big(currentMaxExpected);
        let max15BitValue = new Big(2).pow(15);
        let max12BitValue = new Big(2).pow(12);

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
        // gainVoltage / shuntResistanceOhms
        let currentMax = gainVoltageHR.div(shuntResistanceOhmsHR).toNumber();

        // For tuning should be rounding between these two values.
        // ----------------------------------
        // Minimum LSB 15 bits 
        // results in uA per bit
        // currentMaxExpected / Math.pow(2,15)
        let minimumLSB = currentMaxExpectedHR.div(max15BitValue).toNumber();

        // Maximum LSB 12 bit
        // results in uA per bit
        // currentMaxExpected / Math.pow(2,12)
        let maximumLSB = currentMaxExpectedHR.div(max12BitValue).toNumber();
        // ----------------------------------

        // page 12 in the ina219 pdf "8.5.1 Programming the Calibration Register"
        // ...While this value yields the highest resolution, 
        // it is common to select a value for the Current_LSB to 
        // the nearest round number above this value to simplify the 
        // conversion of the Current Register (04h) and 
        // Power Register (03h) to amperes and watts respectively

        // I am not rounding it here. 1 way to round it is look at
        // maximumLSB and round up - all other libs seem to use 0.1
        // this is essentially minimumLSB
        let currentLSB = currentMaxExpectedHR.div(max15BitValue).toNumber();
        
        // Attempt at rounding the currentLSB
        let currentLSB_R = new Big(currentLSB).round(5, 1).toNumber(); 

        // trunc prior to assign
        // #note: 0.04096 is an internal fixed value in ina219
        let calculationValue = new Big(0.04096 / (currentLSB * shuntResistanceOhmsHR)).round(0,0).toNumber();
        let calculationValue_R = new Big(0.04096 / (currentLSB_R * shuntResistanceOhmsHR)).round(0,0).toNumber();

        // 20 is an internal fixed value in ina219
        let powerLSB = currentLSB * 20;

        // update internal values
        this.currentLSB = currentLSB;
        this.currentLSB_R = currentLSB_R;
        this.powerLSB = powerLSB;
        this.calculationValue = calculationValue;
        this.calculationValue_R = calculationValue_R;

        // send back results in case needed
        return {
            currentLSB,
            currentLSB_R,
            powerLSB,
            calculationValue,
            calculationValue_R
        }

    }

}

export default new CalibrationModel();