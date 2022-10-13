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
 import { mappedLabelsAndBits, registerAsBinaryString } from "../Utilities/index.js";

 class CurrentModel {
 
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
      * @method CurrentModel#hydrate
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
      * @method CurrentModel#formatData
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
         let current = currentValue * 0.1 / 1000; // TODO: -> this.currentConfiguration.currentLSB;
         this.currentFormattedData = {
             register: "Current",
             value: current,
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
      * @method CurrentModel#getCurrentValues
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
 
 export default new CurrentModel();