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

    /**
     * @method Configuration#getConfiguration
     * 
     * @summary
     * Main get configuration action
     * 
     * @description
     * Uses the Configuration Service to Read the configuration register 
     * and then populate the model with the data.
     * Returns back the DTO with optional extended data.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    getConfiguration = async function (language = "en", extendedData = true) {
        let readResult = await ConfigurationService.readRegister();
        if (!readResult.success) return readResult;

        ConfigurationModel.hydrate(readResult.data, language, extendedData);

        return {
            success: true,
            msg: "Configuration",
            data: ConfigurationModel.getCurrentValues()
        }
    }


    /**
     * @method Configuration#setConfiguration
     * 
     * @summary
     * Raw sets INA219 Configuration by its entire register value
     * 
     * @description
     * Use exposed INA219 Constants to generate a totally custom register value
     * and set it as the configuration 
     * 
     * @async
     * @param {Number} configAsDecimal decimal version of configuration register
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    setConfiguration = async function (configAsDecimal) {

        // update Register
        let configurationUpdated = await ConfigurationService.writeRegister(configAsDecimal);
        if (!configurationUpdated.success) return configurationUpdated;

        let readResult = this.getConfiguration();
        if (!readResult.success) return readResult;

        return {
            success: true,
            msg: "Configuration register updated",
            data: readResult.data
        }
    }

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
     * @async
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
        if (!configurationUpdated.success) return configurationUpdated;

        // update model values and return them
        let updatedTemplate = ConfigurationModel.setActiveTemplate(
            TEMPLATES[templateId]
        );

        return {
            success: true,
            msg: "Configuration register updated",
            data: updatedTemplate
        }

    }

    /**
     * @method Configuration#setConfigurationMode
     * 
     * @summary
     * Set sensor operational mode
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
     * @async
     * @param {String} modeConstant Constants.CONFIGURATION.MODE
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setConfigurationMode = async function (modeConstant = "SANDBVOLT_CONTINUOUS") {

        // calculates new configuration registry value
        // TODO: should be moved to ConfigurationService
        let newConfiguration = ConfigurationModel.editConfigurationMode(
            ConfigurationModel.getCurrentConfiguration(),
            modeConstant
        );

        // update Register
        let configurationUpdated = await ConfigurationService.writeRegister(newConfiguration);
        if (!configurationUpdated.success) return configurationUpdated;

        let readResult = this.getConfiguration();
        if (!readResult.success) return readResult;

        return {
            success: true,
            msg: "Configuration register updated",
            data: readResult.data
        }

    }

    /**
     * @method Configuration#setConfigurationMode
     * 
     * @summary
     * Set sensor FSR / BusVoltage Range
     * 
     * @description
     * INA219 actually works only up to 26V so I am not sure what the 
     * deal is with 32V being available to set.
     * Bus Voltage Range either 16V or 32V. Default is 32V.
     * Ranges are found in ./Constants/index.js or through auto-complete
     * via Constants.CONFIGURATION.BUS_VOLTAGE_RANGE
     * bit position set is [ 13 ] see page 19 table 3 in the PDF for ina219 
     * 
     * RANGE_16V: 0x00, 
     * RANGE_32V: 0x01
     * 
     * @async
     * @param {String} rangeConstant Constants.CONFIGURATION.BUS_VOLTAGE_RANGE
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setConfigurationBRNG = async function (rangeConstant = "RANGE_32V") {

        // calculates new configuration registry value
        // TODO: should be moved to ConfigurationService
        let newConfiguration = ConfigurationModel.editConfigurationBRNG(
            ConfigurationModel.getCurrentConfiguration(),
            rangeConstant
        );

        // update Register
        let configurationUpdated = await ConfigurationService.writeRegister(newConfiguration);
        if (!configurationUpdated.success) return configurationUpdated;

        let readResult = this.getConfiguration();
        if (!readResult.success) return readResult;

        return {
            success: true,
            msg: "Configuration register updated",
            data: readResult.data
        }
    }

    /**
     * @method Configuration#setConfigurationPGA
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
     * @async
     * @param {String} gainConstant Constants.CONFIGURATION.GAIN
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setConfigurationPGA = async function (gainConstant = "DIV_8_320MV") {

        // calculates new configuration registry value
        // TODO: should be moved to ConfigurationService
        let newConfiguration = ConfigurationModel.editConfigurationPGain(
            ConfigurationModel.getCurrentConfiguration(),
            gainConstant
        );

        // update Register
        let configurationUpdated = await ConfigurationService.writeRegister(newConfiguration);
        if (!configurationUpdated.success) return configurationUpdated;

        let readResult = this.getConfiguration();
        if (!readResult.success) return readResult;

        return {
            success: true,
            msg: "Configuration register updated",
            data: readResult.data
        }
    }


    /**
     * @method Configuration#setConfigurationBADC
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
     * @async
     * @param {String} bADCConstant Constants.CONFIGURATION.BUS_ADC_RESOLUTION
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setConfigurationBADC = async function (bADCConstant = "ADCRES_12BIT_32S") {

        // calculates new configuration registry value
        // TODO: should be moved to ConfigurationService
        let newConfiguration = ConfigurationModel.editConfigurationBADC(
            ConfigurationModel.getCurrentConfiguration(),
            bADCConstant
        );

        // update Register
        let configurationUpdated = await ConfigurationService.writeRegister(newConfiguration);
        if (!configurationUpdated.success) return configurationUpdated;

        let readResult = this.getConfiguration();
        if (!readResult.success) return readResult;

        return {
            success: true,
            msg: "Configuration register updated",
            data: readResult.data
        }
    }

    /**
     * @method Configuration#setConfigurationSADC
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
     * @async
     * @param {String} sADCConstant Constants.CONFIGURATION.SHUNT_ADC_RESOLUTION
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto 
     */
    setConfigurationSADC = async function (sADCConstant = "ADCRES_12BIT_32S") {

        // calculates new configuration registry value
        // TODO: should be moved to ConfigurationService
        let newConfiguration = ConfigurationModel.editConfigurationSADC(
            ConfigurationModel.getCurrentConfiguration(),
            sADCConstant
        );

        // update Register
        let configurationUpdated = await ConfigurationService.writeRegister(newConfiguration);
        if (!configurationUpdated.success) return configurationUpdated;

        let readResult = this.getConfiguration();
        if (!readResult.success) return readResult;

        return {
            success: true,
            msg: "Configuration register updated",
            data: readResult.data
        }
    }

}

export default new Configuration();