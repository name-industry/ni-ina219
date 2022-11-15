// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class NI_INA219
 * 
 * @summary 
 * (v.0.0.6) - WaveShare UPS Raspberry Pi Hat uses a Texas Instruments INA219_sensor
 * 
 * @description 
 * Texas Instruments INA219 Zero-Drift Bi-Directional Current/Power 
 * monitor with I2c interface. 
 * 
 * <br /><br />
 * [INA219 Chip Specs]{@link https://www.waveshare.com/w/upload/1/10/Ina219.pdf}<br />
 * [WaveShare UPS Product page]{@link https://www.waveshare.com/product/raspberry-pi/hats/ups-hat.htm}
 * <br /><br />
 * This library builds on these two versions:<br />
 * <br />
 * [WaveShare's Python demo code]{@link https://www.waveshare.com/wiki/UPS_HAT}<br />
 * [nodejs version by brettmarl on GitHub]{@link https://github.com/brettmarl/node-ina219}
 * <br />
 * <br />
 * Uses [I2c-bus]{@link https://github.com/fivdi/i2c-bus} temporarily for developing - 
 * but will be removed once complete as the module should be provided a promise-based bus 
 * on instantiation.<br /><br />
 * 
 * Testing hardware:<br /> 
 * 1 x Raspberry Pi 4b with the WaveShare UPS hat installed.<br />
 * 2 x NCR18650B 18650 Battery<br /><br />
 * #note: Battery type Panasonic-Japan 3400mAh Li-ion 3.7V Flat Top Rechargeable [3.6 <> 4.2 cutoff 2.5]<br />
 * [specs]{@link https://www.orbtronic.com/content/NCR18650B-Datasheet-Panasonic-Specifications.pdf}<br />
 */

import { Constants } from "./Constants/index.js";
import { Models } from "./Models/index.js";

// Actions/Domains
import Device from "./Actions/Device/index.js";
import Configuration from "./Actions/Configuration/index.js";
import Calibration from "./Actions/Calibration/index.js";
import BusVoltage from "./Actions/BusVoltage/index.js";
import ShuntVoltage from "./Actions/ShuntVoltage/index.js";
import Power from "./Actions/Power/index.js";
import Current from "./Actions/Current/index.js";

// Temp responder in input file
// TODO: move into Action files 
import { outputAsJson } from "./Responder/index.js";

class NI_INA219 {

    /**
     * @method NI_INA219#initialize
     * 
     * @summary
     * Start register/calibrate bus & sensor
     * 
     * @description 
     * Gets a handler to the INA219 chip via I2c.
     * On success configures the chip and runs an initial
     * calibration to ensure correct values on the 
     * register.
     * 
     * @async 
     * 
     * @param {Number} i2cAddress Address in hex of the sensor ie: 0x24
     * @param {Number} busNumber The Bus address as an integer ie: 1 ( for PI )
     * @param {*} configurationTemplateId Configuring the sensor and calibration template Id
     * @param {*} useLogging Not implemented
     * @param {*} loggingType Not implemented
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto 
     */
    initialize = async function (
        i2cAddress = Constants.DEFAULT_I2C_ADDRESS,
        busNumber = Constants.DEFAULT_I2C_BUS,
        configurationTemplateId = "32V2A",
        useLogging = false,
        loggingType = "VERBOSE"
    ) {

        // get handle to I2c bus and sensor
        let initI2cBus = await Device.initialize(i2cAddress, busNumber);
        if (initI2cBus.success === false) return initI2cBus;

        // write the configuration to the chip register
        let configurationUpdated = await Configuration.setConfigurationByTemplateId(configurationTemplateId);
        if (configurationUpdated.success === false) return configurationUpdated;

        let calibrationUpdated = await Calibration.setCalibrationByTemplateId(configurationTemplateId);
        if (calibrationUpdated.success === false) return calibrationUpdated;

        return {
            success: true,
            msg: "[UPS BOARD] - Ready",
            data: {}
        }

    }

    /**
     * @method NI_INA219#getDeviceInformation
     * 
     * @summary
     * Device / Sensor information
     * 
     * @description 
     * For parent application usage. Can request this to check on 
     * status and current configuration or if not initialized and connected
     * the retrieve some manufacturer and sensor information for ux/ui
     * 
     * @async 
     * 
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto 
     */
    getDeviceInformation = async function () {
        // Hook - Pre-Action
        let result = await Device.getDeviceInformation(Configuration, Calibration);
        // Hook - Post-Action
        return outputAsJson(result, {passThrough: true});
    }

    /**
     * @method NI_INA219#getConfiguration
     * 
     * @summary
     * Read UPS Board's settings register
     * 
     * @description
     * Read the INA219 sensor chip settings from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns dto
     */
    getConfiguration = async function () {
        // Hook - Pre-Action
        let result = await Configuration.getConfiguration();
        // Hook - Post-Action
        return outputAsJson(result, {});
    }

    /**
     * 
     * @param {*} busVoltageMax 
     * @param {*} shuntResistanceOhms 
     * @param {*} gainVoltage 
     * @param {*} currentMaxExpected 
     * @returns 
     */
    setCustomCalibration = async function (busVoltageMax, shuntResistanceOhms, gainVoltage, currentMaxExpected) {
        // Hook - Pre-Action
        let result = await Calibration.setCustomCalibration(
            busVoltageMax,
            shuntResistanceOhms,
            gainVoltage,
            currentMaxExpected
        );
        // Hook - Post-Action
        return outputAsJson(result, {});
    }

    /**
     * @method NI_INA219#getCalibration
     * 
     * @summary
     * Read UPS Board's calibration register
     * 
     * @description
     * Read the INA219 sensor chip calibration register from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getCalibration = async function () {
        // Hook - Pre-Action
        let result = await Calibration.getCalibration();
        // Hook - Post-Action
        return outputAsJson(result, {});
    }

    /**
     * @method NI_INA219#getBusVoltage
     * 
     * @summary
     * Read the INA219 bus voltage measurement
     * 
     * @description
     * Read the INA219 sensor chip register where the bus voltage has been stored
     * from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getBusVoltage = async function () {
        // Hook - Pre-Action
        let result = await BusVoltage.getBusVoltage();
        // Hook - Post-Action
        return outputAsJson(result, {});
    }

    /**
     * @method NI_INA219#getShuntVoltage
     * 
     * @summary
     * Read the INA219 shunt voltage measurement
     * 
     * @description
     * Read the INA219 sensor chip register where the shunt voltage has been stored
     * from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getShuntVoltage = async function () {
        // Hook - Pre-Action
        let result = await ShuntVoltage.getShuntVoltage();
        // Hook - Post-Action
        return outputAsJson(result, {});
    }

    /**
     * @method NI_INA219#getPower
     * 
     * @summary
     * Read the INA219 power measurement
     * 
     * @description
     * Read the INA219 sensor chip register where the Power measurement has been stored
     * from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getPower = async function () {
        // Hook - Pre-Action
        let calculationValues = Calibration.getCalculationValues();
        let result = await Power.getPower(calculationValues.powerLSB);
        // Hook - Post-Action
        return outputAsJson(result, {});
    }

    /**
     * @method NI_INA219#getCurrent
     * 
     * @summary
     * Read the INA219 Current measurement
     * 
     * @description
     * Read the INA219 sensor chip register where the Current measurement has been stored
     * from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getCurrent = async function () {
        // Hook - Pre-Action
        let calculationValues = Calibration.getCalculationValues();
        let result = await Current.getCurrent(calculationValues.currentLSB);
        // Hook - Post-Action
        return outputAsJson(result, {});
    }

    /**
     * @method NI_INA219#getPowerSupplyVoltage
     * 
     * @summary
     * Custom calculation based on demo code in WaveShare
     * 
     * @description
     * In the WaveShare Wiki for this HAT there is a commented out measurement for 
     * returning the PSU voltage. They calculate it as the Bus Voltage + Shunt Voltage.
     * This method is here for functional parity. If not using this hat, can ignore.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getPowerSupplyVoltage = async function () {
        let busVoltage = await this.getBusVoltage();
        let shuntVoltage = await this.getShuntVoltage();

        if (busVoltage.success && shuntVoltage.success) {
            Models.powerSupplyModel.hydrate(
                {
                    busVoltage: busVoltage,
                    shuntVoltage: shuntVoltage
                },
                "en",
                true
            );
            return outputAsJson(Models.powerSupplyModel.getCurrentValues(), {});
        } else {
            // return first error for now
            // TODO: generate a compound error dto
            return (busVoltage.success === true) ? shuntVoltage : busVoltage;
        }
    }

    /**
     * @method NI_INA219#getChargeRemaining
     * 
     * @summary
     * Custom calculation based on demo code in WaveShare
     * 
     * @description
     * In the WaveShare Wiki for this HAT there is a commented out measurement for 
     * returning the PSU voltage. They calculate it as the Bus Voltage + Shunt Voltage.
     * This method is here for functional parity. If not using this hat, can ignore.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getChargeRemaining = async function () {
        let busVoltage = await this.getBusVoltage();
        if (busVoltage.success === true) {
            Models.chargeRemainingModel.hydrate(busVoltage.data, "en", true);
            return outputAsJson(Models.chargeRemainingModel.getCurrentValues(), {});
        } else {
            return busVoltage;
        }
    }

}

export default new NI_INA219();