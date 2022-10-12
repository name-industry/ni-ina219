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

import {
    CONFIGURATION_MAP,
    SHUNT_VOLTAGE_MAP,
    BUS_VOLTAGE_MAP,
    POWER_MAP,
    CURRENT_MAP,
    CALIBRATION_MAP
} from "./Src/Models/index.js";

import {
    formatRegisterOutput
} from "./Src/Utilities/index.js";

import I2CBus from "./Src/Bus/I2C/index.js";

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
     * @param {Number} i2cAddress Address in hex of the sensor ie: 0x24
     * @param {Number} busNumber The Bus address as an integer ie: 1 ( for PI ) 
     * @param {String} configId Configuring the sensor and calibration template Id
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    initialize = async function (
        i2cAddress = DEFAULT_I2C_ADDRESS,
        busNumber = DEFAULT_I2C_BUS,
        configId = "32V2A"
    ) {
        // get handle to I2c bus and sensor
        let initI2cBus = await I2CBus.initialize(i2cAddress, busNumber);
        if (initI2cBus.success === false) return initI2cBus;

        // set the sensors configuration register values
        let deviceReady = await this.configureAndCalibrateDevice(configId);
        // TODO: update errors here on scaffold

        if (initI2cBus.success && deviceReady?.success) {
            return {
                success: true,
                msg: "[UPS BOARD] - Ready",
                data: {}
            }
        } else {
            return {
                success: false,
                msg: "[UPS BOARD] - Unable to start board",
                data: {
                    errors: [
                        {
                            "I2c": {
                                msg: initI2cBus.msg,
                                data: initI2cBus.data
                            }
                        },
                        {
                            "Sensor": {
                                msg: deviceReady.msg,
                                data: deviceReady.data
                            }
                        }
                    ]
                }
            }
        }
    }

    /**
     * @method NI_INA219#configureAndCalibrateDevice
     * 
     * @summary
     * Temp method
     * 
     * @description
     * Temporary method for testing promise error on I2c connect/read/write
     * Will be moved to a proper folder later
     * 
     * @async
     * @param {String} configId Configuring the sensor and calibration template Id
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    configureAndCalibrateDevice = async function (
        configId
    ) {
        if (configId === "32V2A") {
            let writeConfiguration = await I2CBus.writeRegister(
                REGISTERS.CONFIG_RW,
                CALIBRATION_TEMPLATES["32V2A"].config);

            if (writeConfiguration?.success === false) {
                return writeConfiguration;
            }

            // run calibrate after config is set to make sure next 
            // readings are correct.
            let writeCalibration = await I2CBus.writeRegister(
                REGISTERS.CALIBRATION_RW,
                CALIBRATION_TEMPLATES["32V2A"].calValue);

            this.CALIBRATION = CALIBRATION_TEMPLATES["32V2A"];
            return {
                success: true,
                msg: "[UPS BOARD] Configured & calibrated",
                data: {
                    usingTemplateId: configId
                }
            }
        } else {
            return {
                success: false,
                msg: "Unknown configuration template Id",
                data: {
                    requestedId: configId
                }
            }
        }
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
        let writeData = await I2CBus.writeRegister(REGISTERS.CALIBRATION_RW, this.CALIBRATION.calValue);
        let readData = await I2CBus.readRegister(register)
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
        let data = await I2CBus.writeRegister(register, value);
        return data;
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
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object
     */
    getSystemSettings = async function () {
        let { success, msg, data } = await this.readRegister(REGISTERS.CONFIG_RW);
        let output = formatRegisterOutput("CONFIGURATION", CONFIGURATION_MAP.LABELS, data.buffer);
        return output;
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
        let { success, msg, data } = await this.readRegister(REGISTERS.CALIBRATION_RW);
        let output = formatRegisterOutput("CONFIGURATION", CALIBRATION_MAP.LABELS, data.buffer);
        return output;
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
        let { success, msg, data } = await this.readRegister(REGISTERS.BUS_VOLTAGE_R);
        let output = formatRegisterOutput("BUS_VOLTAGE", BUS_VOLTAGE_MAP.LABELS, data.buffer);
        output.asFloat = (data.payload >> 3) * 0.004;
        return output;
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
        let { success, msg, data } = await this.readRegister(REGISTERS.SHUNT_VOLTAGE_R);
        let output = formatRegisterOutput("SHUNT_VOLTAGE", SHUNT_VOLTAGE_MAP.LABELS_PGA_8, data.buffer);
        output.asFloat = data.payload * 0.01 / 1000;
        return output;
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
        let { success, msg, data } = await this.readRegister(REGISTERS.POWER_R);
        let output = formatRegisterOutput("POWER", POWER_MAP.LABELS, data.buffer);
        output.asFloat = data.payload * this.CALIBRATION.powerLSB;
        return output;
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
        let { success, msg, data } = await this.readRegister(REGISTERS.CURRENT_R);
        let output = formatRegisterOutput("CURRENT", CURRENT_MAP.LABELS, data.buffer);
        output.asFloat = data.payload * this.CALIBRATION.currentLSB / 1000;
        return output;
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