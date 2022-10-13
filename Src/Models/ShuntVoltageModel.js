/**
 * @class ShuntVoltageModel
 * 
 * @summary
 * SHUNT VOLTAGE REGISTER: PDF REF: Figure 20 - 23 pg. 21
 * 
 * @description
 * Depends on PGA settings<br />
 * default is +8 (320mV range) see PDF pg.19 Table 4. PG Bit Settings
 */
 import { mappedLabelsAndBits, registerAsBinaryString } from "../Utilities/index.js";

 class ShuntVoltageModel {
 
     constructor() {
         /** @type {object | undefined} */
         this.currentRawData;
         /** @type {object | undefined} */
         this.currentFormattedData;
         /** @type {string} */
         this.language = "en";
         /** @type {boolean} */
         this.useFullReturn = false;
         /** @type {string} */
         this.pgaType = "PGA_8"
     }
     /**
      * @method ShuntVoltageModel#hydrate
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
     bitLabels = {
         PGA_8: [
             'SIGN',
             'SD14_8', 'SD13_8', 'SD12_8', 'SD11_8',
             'SD10_8', 'SD9_8', 'SD8_8', 'SD7_8',
             'SD6_8', 'SD5_8', 'SD4_8', 'SD3_8',
             'SD2_8', 'SD1_8', 'SD0_8'
         ],
         PGA_4: [
             'SIGN',
             'SIGN', 'SD13_4', 'SD12_4', 'SD11_4',
             'SD10_4', 'SD9_4', 'SD8_4', 'SD7_4',
             'SD6_4', 'SD5_4', 'SD4_4', 'SD3_4',
             'SD2_4', 'SD1_4', 'SD0_4'
         ],
         PGA_2: [
             'SIGN',
             'SIGN',
             'SIGN',
             'SD12_2', 'SD11_2',
             'SD10_2', 'SD9_2', 'SD8_2', 'SD7_2',
             'SD6_2', 'SD5_2', 'SD4_2', 'SD3_2',
             'SD2_2', 'SD1_2', 'SD0_2'
         ],
         PGA_1: [
             'SIGN',
             'SIGN',
             'SIGN',
             'SIGN',
             'SD11_2', 'SD10_2', 'SD9_2', 'SD8_2', 'SD7_2',
             'SD6_2', 'SD5_2', 'SD4_2', 'SD3_2',
             'SD2_2', 'SD1_2', 'SD0_2'
         ]
     };
 
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
             full: "milli-volt",
             plural: "milli-volts",
             short: "mV"
         }
     }
 
     /**
      * @method ShuntVoltageModel#formatData
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
         let shuntVoltage = currentValue * 0.01 / 1000;
         this.currentFormattedData = {
             register: "ShuntVoltage",
             value: shuntVoltage,
             valueType: this.measurement[this.language]
         }
         if (this.useFullReturn === true) {
             this.currentFormattedData["extended"] = {
                 mappedLabelsAndBits: mappedLabelsAndBits(this.bitLabels[this.pgaType], this.currentRawData.buffer),
                 registerAsBinaryString: registerAsBinaryString(this.currentRawData.buffer)
             }
         }
     }
 
     /**
      * @method ShuntVoltageModel#getCurrentValues
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
 
 export default new ShuntVoltageModel();