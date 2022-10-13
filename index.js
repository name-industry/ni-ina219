/**
 * @class NI_INA219
 * 
 * @summary 
 * (v.0.0.1) - WaveShare UPS Raspberry Pi Hat uses a TI INA219_sensor
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

 import {
    DEFAULT_I2C_ADDRESS,
    DEFAULT_I2C_BUS,
    REGISTERS,
    CALIBRATION_TEMPLATES
} from "./Src/Constants/index.js";

import { Models } from "./Src/Models/index.js";
import { outputAsJson } from "./Src/Responder/index.js";

import I2CBus from "./Src/Bus/I2C/index.js";

class NI_INA219 {

    currentConfiguration;

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
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object 
     */
    initialize = async function (
        i2cAddress = DEFAULT_I2C_ADDRESS,
        busNumber = DEFAULT_I2C_BUS,
        configurationTemplateId = "32V2A",
        useLogging = false,
        loggingType = "VERBOSE"
    ) {
        // get handle to I2c bus and sensor
        let initI2cBus = await I2CBus.initialize(i2cAddress, busNumber);
        if (initI2cBus.success === false) return initI2cBus;

        // write the configuration to the chip register
        let writeConfiguration = await this.writeConfiguration(configurationTemplateId);
        if (writeConfiguration.success === false) return writeConfiguration;

        // update class
        this.setCurrentConfiguration(writeConfiguration.data);

        // write calibration values to the chip register
        let writeCalibration = await this.writeCalibration();
        if (writeCalibration.success === false) return writeCalibration;

        return {
            success: true,
            msg: "[UPS BOARD] - Ready",
            data: {}
        }

    }

    /**
     * @method NI_INA219#setCurrentConfiguration
     * 
     * @summary
     * Class setter for keeping track of set configuration settings
     * 
     * @param {object} configurationTemplate 
     */
    setCurrentConfiguration = function (configurationTemplate = {}) {
        this.currentConfiguration = configurationTemplate;
    }

    /**
     * @method NI_INA219#readRegister
     * 
     * @summary
     * I2c read method wrapper
     * 
     * @description
     * Wrapper for reading on the I2c Bus. Some registers require a write to 
     * kickstart the measuring / calculation before it can be read
     * For now we re-run the calibration write prior to reading
     * The speed of the sample rate in the config should be ok for reading
     * the results post write
     * 
     * @async
     * @param {Number} register Address in hex of the Register to be read ie: 0x2
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    readRegister = async function (register) {
        // trigger fresh calcs
        let writeData = await this.writeCalibration();
        if (writeData.success === false) return writeData;

        // read values
        let readData = await I2CBus.readRegister(register);
        if (readData.success === false) return readData;

        return readData;
    }

    /**
     * @method NI_INA219#writeRegister
     * 
     * @summary
     * I2c write method wrapper
     * 
     * @description
     * Wrapper into the I2c lib to allow refactoring
     * 
     * @async
     * @param {Number} register Address in hex of the Register to write ie: 0x2
     * @param {*} value What to write to the Register
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    writeRegister = async function (register, value) {
        return await I2CBus.writeRegister(register, value);
    }

    /**
     * @method NI_INA219#writeConfiguration
     *
     * @summary
     * Write the configuration the the Chip register 
     * 
     * @description
     * Uses a template Id to select from pre-made system configurations
     * and calculation values. Currently only "32V2A" ( 32 volts and 2 amps )
     * is available
     * 
     * @param {string} configurationTemplateId
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns value object 
     */
    writeConfiguration = async function (configurationTemplateId) {
        if (configurationTemplateId !== "32V2A") {
            return {
                success: false,
                msg: "Unknown configuration template Id",
                data: {
                    requestedId: configurationTemplateId
                }
            }
        }

        let config = CALIBRATION_TEMPLATES[configurationTemplateId].config;
        let writeResult = await I2CBus.writeRegister(REGISTERS.CONFIG_RW, config);
        if (writeResult.success === true) {
            writeResult.data = CALIBRATION_TEMPLATES[configurationTemplateId];
            return writeResult;
        } else {
            return writeResult;
        }
    }

    /**
     * @method NI_INA219#writeCalibration
     * 
     * @summary
     * Write the calibration value the the Chip register 
     * 
     * @description
     * When the system board settings are saved in the configuration 
     * register, we get back calibration and measurement values that
     * we can use to calibrate the results. This method also can be 
     * used along with reading Power to trigger the main read register
     * to calculate fresh values.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns value object 
     */
    writeCalibration = async function () {
        return await I2CBus.writeRegister(REGISTERS.CALIBRATION_RW, this.currentConfiguration.calValue);
    }

    /**
     * @method NI_INA219#getSystemSettings
     * 
     * @summary
     * Read UPS Board's settings register
     * 
     * @description
     * Read the INA219 sensor chip settings from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns value object
     */
    getSystemSettings = async function () {
        let readResult = await this.readRegister(REGISTERS.CONFIG_RW);
        if (readResult.success === true) {
            Models.configuration.hydrate(readResult.data, "en", true);
            return outputAsJson(Models.configuration.getCurrentValues(), {});
        } else {
            return readResult;
        }
    }

    /**
     * @method NI_INA219#getSystemCalibration
     * 
     * @summary
     * Read UPS Board's calibration register
     * 
     * @description
     * Read the INA219 sensor chip calibration register from the I2c bus on the UPS board.
     * This is a method an external program would call.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    getSystemCalibration = async function () {
        let readResult = await this.readRegister(REGISTERS.CALIBRATION_RW);
        if (readResult.success === true) {
            Models.calibration.hydrate(readResult.data, "en", true);
            return outputAsJson(Models.calibration.getCurrentValues(), {});
        } else {
            return readResult;
        }
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
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    getBusVoltage = async function () {
        let readResult = await this.readRegister(REGISTERS.BUS_VOLTAGE_R);
        if (readResult.success === true) {
            Models.busVoltage.hydrate(readResult.data, "en", true);
            return outputAsJson(Models.busVoltage.getCurrentValues(), {});
        } else {
            return readResult;
        }
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
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    getShuntVoltage = async function () {
        let readResult = await this.readRegister(REGISTERS.SHUNT_VOLTAGE_R);
        if (readResult.success === true) {
            Models.shuntVoltage.hydrate(readResult.data, "en", true);
            return outputAsJson(Models.shuntVoltage.getCurrentValues(), {});
        } else {
            return readResult;
        }
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
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    getPower = async function () {
        let readResult = await this.readRegister(REGISTERS.POWER_R);
        if (readResult.success === true) {
            Models.power.hydrate(readResult.data, "en", true);
            return outputAsJson(Models.power.getCurrentValues(), {});
        } else {
            return readResult;
        }
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
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    getCurrent = async function () {
        let readResult = await this.readRegister(REGISTERS.CURRENT_R);
        if (readResult.success === true) {
            Models.current.hydrate(readResult.data, "en", true);
            return outputAsJson(Models.current.getCurrentValues(), {});
        } else {
            return readResult;
        }
    }

}

/**
 * @typedef {Object} ErrorResultObject
 * @property {boolean} success - Method result
 * @property {string} msg - Method message
 * @property {object} data - Method payload
 */

/**
 * @typedef {Object} ResultObject
 * @property {boolean} success - Method result
 * @property {string} msg - Method message
 * @property {object} data - Method payload
 */

export default new NI_INA219();