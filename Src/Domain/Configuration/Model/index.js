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
import BaseRegisterModel from "../../BaseModels/BaseRegisterModel.js";

class ConfigurationModel extends BaseRegisterModel {

    /** @type {object | undefined} */
    activeTemplate;

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
     * @method ConfigurationModel#setActiveTemplate
     * 
     * @summary
     * 
     * @description
     * 
     * @param {number} newActiveTemplate 
     * @returns {object} activeTemplate
     */
     setActiveTemplate = function (template) {
        if (template !== undefined) {
            this.activeTemplate = template;
        } else {
            this.activeTemplate = undefined; // unset
        }
        return this.activeTemplate || {}
    }

    mapConfigurationToValues = function () {
        let configurationRegisterAsDecimal = this.currentConfiguration;
        // we want FSR 16V or 32V bit 13 0 === 16 1 === 32
        let BRNG = 32;
    }

    /**
     * @method ConfigurationModel#getCurrentConfiguration
     * 
     * @summary
     * 
     * @description
     * 
     * @returns {number} configuration as an int
     */
    getCurrentConfiguration = function () {
        return this.currentConfiguration;
    }

    /**
     * @method ConfigurationModel#editConfigurationMode
     * 
     * @summary
     * Edit mode bits in configuration register
     * 
     * @description
     * Heavy handed way to open up MODES in the configuration register
     * by calculating a new config for the last 3 bits [x x x x x 2 1 0]
     * Takes an oldConfiguration decimal value - stored in the main class
     * after initializing or setting a new configuration by template.
     * 
     * Returns the new config decimal for use in writing the new config to
     * the register
     * 
     * @param {int} oldConfiguration the decimal value of the configuration register 
     * @param {string} mode the name of the mode in the Constants file
     * @returns {number}  returns new config register as base 10 
     */
    editConfigurationMode = function (oldConfiguration, mode) {
        let modeHexValue = Constants.CONFIGURATION.MODE[mode];
        let newConfigBits = ((oldConfiguration >>> modeHexValue) << modeHexValue) | modeHexValue;
        return newConfigBits;
    }

    /**
     * @method ConfigurationModel#editConfigurationBRNG
     * 
     * @summary
     * Edit Bus-Voltage-Range bit in configuration register
     * 
     * @description
     * Edit voltage amount in configuration calculating a new config for 
     * the bit 13  [ x - 13 x, x x x x | x x x x, x x x x]
     * Takes an oldConfiguration decimal value - stored in the main class
     * after initializing or setting a new configuration by template.
     * 
     * only 2 values in ina219 -> 16V and 32V
     * 
     * Returns the new config decimal for use in writing the new config to
     * the register
     * 
     * accepts:
     * "RANGE_16V": 0x00
     * "RANGE_32V": 0x01 
     * 
     * @param {int} oldConfiguration the decimal value of the configuration register 
     * @param {string} mode the name of the bus voltage range key in the Constants file
     * @returns {number}  returns new config register as base 10 
     */
    editConfigurationBRNG = function (oldConfiguration, range) {
        // mask and clear the bit
        let mask = ~(1 << 13);
        let clearedOldConfiguration = oldConfiguration & mask;
        // set new value to that bit
        let rangeHexValue = Constants.CONFIGURATION.BUS_VOLTAGE_RANGE[range];
        let newConfigBits = clearedOldConfiguration | (rangeHexValue << 13);
        return newConfigBits;
    }

    /**
     * @method ConfigurationModel#editConfigurationPGain
     * 
     * @summary
     * Edit PG-Gain bits in configuration register
     * 
     * @description
     * PGA (Shunt Voltage Only)
     * Edit PGA gain and range amount in configuration. 
     * The bits 11 -> 12  [ x - x 12, 11 x x x | x x x x, x x x x]
     * Takes an oldConfiguration decimal value - stored in the main class
     * after initializing or setting a new configuration by template.
     * 
     * Returns the new config decimal for use in writing the new config to
     * the register
     * 
     * accepts:
     * "RANGE_16V": 0x00
     * "RANGE_32V": 0x01 
     * 
     * @param {int} oldConfiguration the decimal value of the configuration register 
     * @param {string} gain the name of the GAIN key in the Constants file
     * @returns {number}  returns new config register as base 10 
     */
    editConfigurationPGain = function (oldConfiguration, gain) {
        // mask and clear the bits
        let mask = (1 << 2) - 1;
        let clearedOldConfiguration = oldConfiguration & ~(mask << 11);
        // set new value to that bit
        let gainHexValue = Constants.CONFIGURATION.GAIN[gain];
        let newConfigBits = clearedOldConfiguration | (gainHexValue << 11);
        return newConfigBits;
    }

    /**
     * @method ConfigurationModel#editConfigurationBADC
     * 
     * @summary
     * Edit Bus ADC bits in configuration register
     * 
     * @description
     * Edit Bus ADC Resolution/Averaging amount in the configuration
     * register. 
     * The bits 7 -> 10  [ x - x x, x 10 9 8 | 7 x x x, x x x x]
     * Takes an oldConfiguration decimal value - stored in the main class
     * after initializing or setting a new configuration by template.
     * 
     * Returns the new config decimal for use in writing the new config to
     * the register
     * 
     * @param {int} oldConfiguration the decimal value of the configuration register 
     * @param {string} bADCConstant the name of the BUS_ADC_RESOLUTION key in the Constants file
     * @returns {number}  returns new config register as base 10 
     */
    editConfigurationBADC = function (oldConfiguration, bADCConstant) {
        // mask and clear the bits
        let mask = (1 << 4) - 1;
        let clearedOldConfiguration = oldConfiguration & ~(mask << 7);
        // set new value to that bit
        let bADCHexValue = Constants.CONFIGURATION.BUS_ADC_RESOLUTION[bADCConstant];
        let newConfigBits = clearedOldConfiguration | (bADCHexValue << 7);
        return newConfigBits;
    }

    /**
     * @method ConfigurationModel#editConfigurationSADC
     * 
     * @summary
     * Edit Shunt ADC bits in configuration register
     * 
     * @description
     * Edit Shunt ADC Resolution/Averaging amount in the configuration
     * register. 
     * The bits 3 -> 6  [ x - x x, x x x x | x 6 5 4, 3 x x x]
     * Takes an oldConfiguration decimal value - stored in the main class
     * after initializing or setting a new configuration by template.
     * 
     * Returns the new config decimal for use in writing the new config to
     * the register
     * 
     * @param {int} oldConfiguration the decimal value of the configuration register 
     * @param {string} sADCConstant the name of the SHUNT_ADC_RESOLUTION key in the Constants file
     * @returns {number}  returns new config register as base 10 
     */
    editConfigurationSADC = function (oldConfiguration, sADCConstant) {
        // mask and clear the bits
        let mask = (1 << 4) - 1;
        let clearedOldConfiguration = oldConfiguration & ~(mask << 3);
        // set new value to that bit
        let sADCHexValue = Constants.CONFIGURATION.SHUNT_ADC_RESOLUTION[sADCConstant];
        let newConfigBits = clearedOldConfiguration | (sADCHexValue << 3);
        return newConfigBits;
    }

}

export default new ConfigurationModel();