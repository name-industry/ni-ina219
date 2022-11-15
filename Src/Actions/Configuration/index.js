// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class Configuration
 * 
 * @summary 
 * Configuration Actions
 * 
 * @description 
 * Actions for the Configuration register on the INA219 
 */

import { TEMPLATES } from "../../Constants/index.js";

import ConfigurationModel from "../../Domain/Configuration/Model/index.js";
import ConfigurationService from "../../Domain/Configuration/Service/index.js";


class Configuration {
    constructor() { };

    /**
     * @method Configuration#setConfigurationByTemplate
     * 
     * @summary
     * Sets INA219 Configuration by its templateId
     * 
     * @description 
     * Set the configuration register by using a provided template. All
     * templates are found in the Constants file currently. If no 
     * templateId is provided the default template "32V2A" is used 
     * which is a slight change from th INA219 Power on defaults.
     * 
     * @param {String} templateId the templateId from Constants ie: "32V2A"
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    setConfigurationByTemplateId = async function (templateId = "32V2A") {

        // is a valid template id
        if (!TEMPLATES.IDS.includes(templateId)) {
            return {
                success: false,
                msg: "Unknown configuration template Id",
                data: {
                    requestedId: templateId
                }
            };
        }

        // update Register
        let configurationUpdated = await ConfigurationService.writeRegister(TEMPLATES[templateId].config);

        if (configurationUpdated.success === true) {
            // update model values and return them
            let updatedTemplate = ConfigurationModel.setActiveTemplate(
                TEMPLATES[templateId]
            );
            return {
                success: true,
                msg: "Configuration register updated",
                data: updatedTemplate
            }
        } else {
            // Error writing register return dto
            return configurationUpdated;
        }

    }

    getConfiguration = async function () {
        let readResult = await ConfigurationService.readRegister();
        if (readResult.success === true) {
            ConfigurationModel.hydrate(readResult.data, "en", true);
            return {
                success: true,
                msg: "Calibration",
                data: ConfigurationModel.getCurrentValues()
            }
        } else {
            return readResult;
        }
    }

    // Collection modes and sensor state
    setConfigurationModes = async function () { }

    // Individual config elements
    setConfigurationBRNG = async function () { }
    setConfigurationPGA = async function () { }
    setConfigurationBADC = async function () { }
    setConfigurationSADC = async function () { }


    /**
     * @method NI_INA219#setMode
     * 
     * @summary
     * Change the MODE to trigger.
     * 
     * @description
     * This will update the configuration to use any Mode available.
     * Modes are found in ./Constants/index.js or through auto-complete
     * via Constants.CONFIGURATION.MODE
     * bits set are [ 2, 1, 0 ] see page 20 table 6 in the PDF for ina219 
     * 
     * POWERDOWN: 0x00, // power down apply it to bits 2,1,0 in the register 
     * SVOLT_TRIGGERED: 0x01, // shunt voltage triggered
     * BVOLT_TRIGGERED: 0x02, // bus voltage triggered 
     * SANDBVOLT_TRIGGERED: 0x03, // shunt and bus voltage triggered
     * ADCOFF: 0x04, // ADC off
     * SVOLT_CONTINUOUS: 0x05, // shunt voltage continuous
     * BVOLT_CONTINUOUS: 0x06, // bus voltage continuous
     * SANDBVOLT_CONTINUOUS: 0x07, // shunt and bus voltage continuous (default)
     * 
     * TODO: map these to human readable constants 
     *       then map it to internal constants
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setMode = async function (modeConstant) {
        let newConfigurationValue = Models.configuration.editConfigurationMode(
            Models.configuration.getCurrentConfiguration(),
            modeConstant);
        let setNewConfigResults = await this.writeRegister(Constants.REGISTERS.CONFIG_RW, newConfigurationValue);
        if (setNewConfigResults.success === true) {
            let updatedValues = Models.configuration.setCurrentConfiguration(
                newConfigurationValue
            );
            return {
                success: true,
                msg: "Configuration register updated",
                data: updatedValues
            }
        } else {
            // error writing register
            return setNewConfigResults;
        }
    }


    /**
     * @method NI_INA219#setBusVoltageRange
     * 
     * @summary
     * Change the Bus Voltage Range.
     * 
     * @description
     * This will update the configuration to make the sensor capture the
     * Bus Voltage Range either 16V or 32V. Default is 32V.
     * Ranges are found in ./Constants/index.js or through auto-complete
     * via Constants.CONFIGURATION.BUS_VOLTAGE_RANGE
     * bit position set is [ 13 ] see page 19 table 3 in the PDF for ina219 
     * 
     * RANGE_16V: 0x00, 
     * RANGE_32V: 0x01
     * 
     * TODO: map these to human readable constants 
     *       then map it to internal constants
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setBusVoltageRange = async function (rangeConstant = "RANGE_32V") {
        let newConfigurationValue = Models.configuration.editConfigurationBRNG(
            Models.configuration.getCurrentConfiguration(),
            rangeConstant);
        let setNewConfigResults = await this.writeRegister(Constants.REGISTERS.CONFIG_RW, newConfigurationValue);
        if (setNewConfigResults.success === true) {
            let updatedValues = Models.configuration.setCurrentConfiguration(
                newConfigurationValue
            );
            return {
                success: true,
                msg: "Configuration register updated",
                data: updatedValues
            }
        } else {
            // error writing register
            return setNewConfigResults;
        }
    }

    /**
     * @method NI_INA219#setPGA
     * 
     * @summary
     * Change the PGA (Shunt Voltage Only) Gain and Range
     * 
     * @description
     * This will update the configuration to make the sensor capture the
     * Bus Voltage Range either 16V or 32V. Default is 32V.
     * Ranges are found in ./Constants/index.js or through auto-complete
     * via Constants.CONFIGURATION.GAIN
     * bit position set is [ 12, 11 ] see page 19 table 4 in the PDF for ina219 
     *
     * DIV_1_40MV:  0x00, // shunt prog. gain set to  1, 40 mV range
     * DIV_2_80MV:  0x01, // shunt prog. gain set to /2, 80 mV range
     * DIV_4_160MV: 0x02, // shunt prog. gain set to /4, 160 mV range
     * DIV_8_320MV: 0x03, // shunt prog. gain set to /8, 320 mV range (default)
     * 
     * TODO: map these to human readable constants 
     *       then map it to internal constants
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setPGA = async function (gainConstant = "DIV_8_320MV") {
        let newConfigurationValue = Models.configuration.editConfigurationPGain(
            Models.configuration.getCurrentConfiguration(),
            gainConstant);
        let setNewConfigResults = await this.writeRegister(Constants.REGISTERS.CONFIG_RW, newConfigurationValue);
        if (setNewConfigResults.success === true) {
            let updatedValues = Models.configuration.setCurrentConfiguration(
                newConfigurationValue
            );
            return {
                success: true,
                msg: "Configuration register updated",
                data: updatedValues
            }
        } else {
            // error writing register
            return setNewConfigResults;
        }
    }

    /**
     * @method NI_INA219#setBADC
     * 
     * @summary
     * Change BADC Bus ADC Resolution/Averaging
     * 
     * @description
     * Change the Bus ADC resolution (9-, 10-, 11-, or 12-bit) 
     * or set the number of samples used when averaging results assuming
     * it uses 12bit resolution after when specifying averaging amounts.
     * Ranges are found in ./Constants/index.js or through auto-complete
     * via Constants.CONFIGURATION.BUS_ADC_RESOLUTION
     * bit positions set is [ 10, 9, 8, 7 ] see page 20 table 5 in the PDF for ina219
     * 
     * TODO: map these to human readable constants 
     *       then map it to internal constants
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setBADC = async function (bADCConstant = "ADCRES_12BIT_32S") {
        let newConfigurationValue = Models.configuration.editConfigurationBADC(
            Models.configuration.getCurrentConfiguration(),
            bADCConstant);
        let setNewConfigResults = await this.writeRegister(Constants.REGISTERS.CONFIG_RW, newConfigurationValue);
        if (setNewConfigResults.success === true) {
            let updatedValues = Models.configuration.setCurrentConfiguration(
                newConfigurationValue
            );
            return {
                success: true,
                msg: "Configuration register updated",
                data: updatedValues
            }
        } else {
            // error writing register
            return setNewConfigResults;
        }
    }

    /**
     * @method NI_INA219#setSADC
     * 
     * @summary
     * Change SADC Shunt ADC Resolution/Averaging
     * 
     * @description
     * Change the Shunt ADC resolution (9-, 10-, 11-, or 12-bit) 
     * or set the number of samples used when averaging results assuming
     * it uses 12bit resolution after when specifying averaging amounts.
     * Ranges are found in ./Constants/index.js or through auto-complete
     * via Constants.CONFIGURATION.SHUNT_ADC_RESOLUTION
     * bit positions set is [ 6, 5, 4, 3 ] see page 20 table 5 in the PDF for ina219
     * 
     * TODO: map these to human readable constants 
     *       then map it to internal constants
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setSADC = async function (bADCConstant = "ADCRES_12BIT_32S") {
        let newConfigurationValue = Models.configuration.editConfigurationSADC(
            Models.configuration.getCurrentConfiguration(),
            bADCConstant);
        let setNewConfigResults = await this.writeRegister(Constants.REGISTERS.CONFIG_RW, newConfigurationValue);
        if (setNewConfigResults.success === true) {
            let updatedValues = Models.configuration.setCurrentConfiguration(
                newConfigurationValue
            );
            return {
                success: true,
                msg: "Configuration register updated",
                data: updatedValues
            }
        } else {
            // error writing register
            return setNewConfigResults;
        }
    }

}

export default new Configuration();