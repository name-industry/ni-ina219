/**
 * @class BaseRegisterModel
 * 
 * @summary
 * Master Class template for modeling Registers
 * 
 * @description
 * TODO: Register information regarding the sensor in question
 */

import Utilities from "../../Utilities/index.js";

class BaseRegisterModel {

    constructor(registerName) {
        /** @type {string} */
        this.registerName = registerName;
        /** @type {object | undefined} */
        this.currentRawData;
        /** @type {object | undefined} */
        this.currentFormattedData;
        /** @type {string} */
        this.language = "en";
        /** @type {boolean} */
        this.useFullReturn = false;
        /** @type {integer} */
        this.defaultPrecision = 4;
        /** @type {object | undefined} */
        this.options;
    }

    /**
     * @method BaseRegisterModel#hydrate
     * 
     * @summary
     * Hydrate the default model with current data
     * 
     * @description
     * Uses the formatted return object from reading the I2c bus
     * <br />
     * Hydrates the model first with the raw data then automatically triggers the
     * result formatting.
     * 
     * @param {object} data {bytesWritten, buffer, int from readInt16BE(0, 2)}
     * @param {string} language default is english. is lower case
     * @param {boolean} useFullReturn for debugging or if UI wants to display register data
     * @param {object|undefined} options for debugging or if UI wants to display register data
     */
    hydrate = function (data, language = "en", useFullReturn = false, options) {
        this.options = options;
        this.language = language;
        this.useFullReturn = useFullReturn;
        this.currentRawData = data;
        this.formatData(data.payload);
    }

    /**
     * @method BaseRegisterModel#formatData
     * 
     * @summary
     * Takes the raw register value and formats it
     * 
     * @description
     * This is where the raw data is formatted to human readable output.
     * The calculation for the end result is done here. Currently no numeric
     * formatting is done. It is the float/int results as is returned in NodeJS 
     * via the Ic2 bus interface. It is saved to the local class
     */
    formatData = function () {
        let currentValue = this.currentRawData.payload;
        let calculatedValue = this.calculateValue(currentValue);
        this.currentFormattedData = {
            register: this.registerName,
            valueRaw: calculatedValue.rawNumber,
            valueString: calculatedValue.withPrecision,
            valueType: this.measurement[this.language]
        }
        if (this.useFullReturn === true) {
            this.currentFormattedData["extended"] = {
                mappedLabelsAndBits: Utilities.mappedLabelsAndBits(this.bitLabels, this.currentRawData.buffer),
                registerAsBinaryString: Utilities.registerAsBinaryString(this.currentRawData.buffer)
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
        en: {}
    }

    /**
     * @method BaseRegisterModel#getCurrentValues
     * 
     * @summary 
     * Placeholder method
     * 
     * @description
     * Default here is to return the raw register value.
     * To be over-ridden in the extended class
     * 
     */
    calculateValue = function (currentValue) {
        return currentValue;
    }

    /**
     * @method BaseRegisterModel#getCurrentValues
     * 
     * @summary
     * return the formatted latest values from the model
     * 
     * @description
     * Returns a cloned object. The formatted object
     * 
     * @returns {object}  returns value object
     */
    getCurrentValues = function () {
        return { ...this.currentFormattedData };
    }
}
export default BaseRegisterModel;