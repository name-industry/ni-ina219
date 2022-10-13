/**
 * @class ConfigurationModel
 * 
 * @summary
 * CONFIGURATION REGISTER: PDF REF: Figure 19 pg. 19
 * @description
 * BIT 15: Reset Bit<br /> 
 *  Set to 1 generates a system reset that is the same as power-on reset
 *  auto-clears.
 * <br /><br />
 * BIT 13: Bus Voltage Range<br />
 *  0 = 16V FSR<br />
 *  1 = 32V FSR
 * <br /><br />
 * BIT 11, 12: PGA (Shunt Voltage Only)<br />
 *  default is +8 (320mV range) see PDF pg.19 Table 4. PG Bit Settings
 * <br /><br />
 * BIT 7-10: BADC Bus ADC resolution/averaging<br />
 *  sets the number of samples used when averaging results for the 
 *  Bus Voltage Register
 *<br /><br />
 * BIT 3-6: SADC Bus ADC resolution/averaging<br />
 *  sets the number of samples used when averaging results for the 
 *  Shunt Voltage Register
 * <br /><br />
 * BIT 0-2: Operating Mode<br />
 *  defaults to continuous shunt and bus measurement mode 
 * 
 */
 import { mappedLabelsAndBits, registerAsBinaryString } from "../Utilities/index.js";

 class ConfigurationModel {
 
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
      * @method ConfigurationModel#hydrate
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
         'RST',
         '-',
         'BRNG',
         'PG1', 'PG0',
         'BADC4', 'BADC3', 'BADC2', 'BADC1',
         'SADC4', 'SADC3', 'SADC2', 'SADC1',
         'MODE3', 'MODE2', 'MODE1'
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
      * @method ConfigurationModel#formatData
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
         let configuration = "";
         this.currentFormattedData = {
             register: "Configuration",
             value: configuration,
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
      * @method ConfigurationModel#getCurrentValues
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
 
 export default new ConfigurationModel();