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
import BaseRegisterModel from "./BaseRegisterModel.js";

class ShuntVoltageModel extends BaseRegisterModel {

    constructor() {
        super("ShuntVoltage");

        // TODO move these to defaults
        // and add in props passed in from constructor

        /** @type {string} */
        this.pgaType = "PGA_8";

        /** @type {array} */
        this.bitLabels = this.bitLabelsExtended[this.pgaType];
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

    /**
     * @type {object}
     * 
     * @summary
     * All bit labels for the shunt voltage register. Because you can change the PGA values 
     * this register can have various settings. This model has all extended variants 
     * 
     * @description
     * These are labels the directly match the reference sensor PDF doc. When
     * debugging or in case UI desires it, arrays of labels and bits in the 
     * register will be matched.
     */
    bitLabelsExtended = {
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
    * @method ShuntVoltageModel#calculateValue
    * 
    * @summary
    * Takes the raw register value and formats it
    * 
    * @description
    * 
    */
    calculateValue = function (currentValue) {
        return currentValue * 0.01 / 1000;
    }
}

export default new ShuntVoltageModel();