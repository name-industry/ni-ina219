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
import BaseRegisterModel from "./BaseRegisterModel.js";

class ConfigurationModel extends BaseRegisterModel {

    constructor() {
        super("Configuration");
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

}

export default new ConfigurationModel();