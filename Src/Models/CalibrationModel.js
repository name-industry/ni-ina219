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

 import { mappedLabelsAndBits, registerAsBinaryString } from "../Utilities/index.js";

 class CalibrationModel {
 
     constructor() {
         /** @type {object | undefined} */
         this.currentRawData;
         /** @type {object | undefined} */
         this.currentFormattedData;
         /** @type {string} */
         this.language = "en";
         /** @type {boolean} */
         this.useFullReturn = false;
         /** @type {Number} */
         this.calibrationValue = 4090;
     }
     /**
      * @method CalibrationModel#hydrate
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
      * @method CalibrationModel#formatData
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
         let calibration = "";
         this.currentFormattedData = {
             register: "Calibration",
             value: calibration,
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
      * @method CalibrationModel#getCurrentValues
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
 
 export default new CalibrationModel();