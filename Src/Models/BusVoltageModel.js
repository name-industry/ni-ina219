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
 import { mappedLabelsAndBits, registerAsBinaryString } from "../Utilities/index.js";

 class BusVoltageModel {
 
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
      * @method BusVoltageModel#hydrate
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
      * @method BusVoltageModel#formatData
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
         let busVoltage = (currentValue >> 3) * 0.004;
         this.currentFormattedData = {
             register: "BusVoltage",
             value: busVoltage,
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
      * @method BusVoltageModel#getCurrentValues
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
 
 export default new BusVoltageModel();