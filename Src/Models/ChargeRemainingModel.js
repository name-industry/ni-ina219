/**
 * @class ChargeRemainingModel
 * 
 * @summary
 * Charge Remaining Model
 * 
 * @description
 * The WaveShare UPS Hat, calculates the battery charge
 * remaining by using the Bus Voltage and calculating 
 * with some "magic numbers". Not actually sure how this is 
 * derived.
 */
import BaseRegisterModel from "./BaseRegisterModel.js";
import Big from "big.js";

class ChargeRemainingModel extends BaseRegisterModel {

    constructor() {
        super("ChargeRemainingModel");
    }

    /**
     * @method ChargeRemainingModel#formatData
     * 
     * @summary
     * Overrides - This model is a calculation only model no registers
     * 
     * @description
     * Extended return format for calculation only. Returns empty objects 
     * where data is not applicable while retaining the method return
     * fingerprint.
     */
    formatData = function () {
        let calculatedValue = this.calculateValue();
        this.currentFormattedData = {
            register: this.registerName,
            valueRaw: 0,
            valueString: calculatedValue.withPrecision,
            valueType: this.measurement[this.language]
        }
        if (this.useFullReturn === true) {
            this.currentFormattedData["extended"] = {
                mappedLabelsAndBits: [],
                registerAsBinaryString: ""
            }
        }
    }

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
            full: "percent",
            plural: "percent",
            short: "%"
        }
    }

    /**
    * @method ChargeRemainingModel#calculateValue
    * 
    * @summary
    * Requires results from BusVoltage
    * 
    * @description
    * Calculate the battery charge remaining in %. Note: I have no
    * idea what 6 or 2.4 is ion regards to.
    */
    calculateValue = function () {
        let calculation = (this.currentRawData.valueRaw - 6) / 2.4 * 100;
        if (calculation > 100) calculation = 100;
        if (calculation < 0) calculation = 0;
        let formatted = new Big(calculation).toFixed(0);
        return {
            rawNumber: calculation,
            withPrecision: formatted
        }
    }
}

export default new ChargeRemainingModel();