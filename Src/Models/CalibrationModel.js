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

class CalibrationModel extends BaseRegisterModel {

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

}

export default new CalibrationModel();