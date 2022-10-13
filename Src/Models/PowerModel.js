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
 import { mappedLabelsAndBits, registerAsBinaryString } from "../Utilities/index.js";

 class PowerModel {
 
     constructor() {
         /** @type {object | undefined} */
         this.currentRawData;
         /** @type {object | undefined} */
         this.currentFormattedData;
         /** @type {string} */
         this.language = "en";
         /** @type {boolean} */
         this.useFullReturn = false;
     }
     /**
      * @method PowerModel#hydrate
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
      */
     hydrate = function (data, language = "en", useFullReturn = false) {
         this.language = language;
         this.useFullReturn = useFullReturn;
         this.currentRawData = data;
         this.formatData(data.payload);
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
      * @method PowerModel#formatData
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
         let powerVoltage = currentValue * 0.002; // TODO: -> this.currentConfiguration.powerLSB;
         this.currentFormattedData = {
             register: "PowerVoltage",
             value: powerVoltage,
             valueType: this.measurement[this.language]
         }
         if (this.useFullReturn === true) {
             this.currentFormattedData["extended"] = {
                 mappedLabelsAndBits: mappedLabelsAndBits(this.bitLabels, this.currentRawData.buffer),
                 registerAsBinaryString: registerAsBinaryString(this.currentRawData.buffer)
             }
         }
     }
 
     /**
      * @method PowerModel#getCurrentValues
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
 
 export default new PowerModel();