// Texas Instruments INA219 Zero-Drift Bi-Directional
// Current/Power monitor with I2c interface.
// https://www.waveshare.com/w/upload/1/10/Ina219.pdf
// 
// testing with 2x NCR18650B 18650 Battery
// Panasonic-Japan 3400mAh Li-ion 3.7V Flat Top Rechargeable [3.6 <> 4.2 cutoff 2.5]
// https://www.orbtronic.com/content/NCR18650B-Datasheet-Panasonic-Specifications.pdf

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

class INA219_sensor {

    constructor() { }

    /**
     * initialize
     * 
     * Gets a handler to the INA219 chip via I2c.
     * On success configures the chip and runs an initial
     * calibration to ensure correct values on the 
     * register.
     * 
     * @param {*} i2cAddress 
     * @param {*} busNumber 
     * @param {*} configId 
     * @returns {ResultObject} Method Object result style
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

    configureAndCalibrateDevice = async function (
        configId
    ) {
        if (configId === "32V2A") {
            let writeConfiguration = await I2CBus.writeRegister(
                REGISTERS.CONFIG_RW,
                CALIBRATION_TEMPLATES["32V2A"].config);

                if(writeConfiguration?.success === false) {
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
     * readRegister
     * 
     * @param {*} register 
     * @returns 
     */
    readRegister = async function (register) {
        let writeData = await I2CBus.writeRegister(REGISTERS.CALIBRATION_RW, this.CALIBRATION.calValue);
        let readData = await I2CBus.readRegister(register)
        return readData;
    }

    /**
     * writeRegister
     * 
     * @param {*} register 
     * @param {*} value 
     * @returns 
     */
    writeRegister = async function (register, value) {
        let data = await I2CBus.writeRegister(register, value);
        return data;
    }

    // ACTIONS

    getSystemSettings = async function () {
        let {success, msg, data} = await this.readRegister(REGISTERS.CONFIG_RW);
        let output = formatRegisterOutput("CONFIGURATION", CONFIGURATION_MAP.LABELS, data.buffer);
        return output;
    }

    getSystemCalibration = async function () {
        let {success, msg, data} = await this.readRegister(REGISTERS.CALIBRATION_RW);
        let output = formatRegisterOutput("CONFIGURATION", CALIBRATION_MAP.LABELS, data.buffer);
        return output;
    }

    getBusVoltage = async function () {
        let {success, msg, data} = await this.readRegister(REGISTERS.BUS_VOLTAGE_R);
        let output = formatRegisterOutput("BUS_VOLTAGE", BUS_VOLTAGE_MAP.LABELS, data.buffer);
        output.asFloat = (data.payload >> 3) * 0.004;
        return output;
    }

    getShuntVoltage = async function () {
        let {success, msg, data} = await this.readRegister(REGISTERS.SHUNT_VOLTAGE_R);
        let output = formatRegisterOutput("SHUNT_VOLTAGE", SHUNT_VOLTAGE_MAP.LABELS_PGA_8, data.buffer);
        output.asFloat = data.payload * 0.01 / 1000;
        return output;
    }

    getPower = async function () {
        let {success, msg, data} = await this.readRegister(REGISTERS.POWER_R);
        let output = formatRegisterOutput("POWER", POWER_MAP.LABELS, data.buffer);
        output.asFloat = data.payload * this.CALIBRATION.powerLSB;
        return output;
    }

    getCurrent = async function () {
        let {success, msg, data} = await this.readRegister(REGISTERS.CURRENT_R);
        let output = formatRegisterOutput("CURRENT", CURRENT_MAP.LABELS, data.buffer);
        output.asFloat = data.payload * this.CALIBRATION.currentLSB / 1000;
        return output;
    }

    //

}

// JSDoc TYPES

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

export default new INA219_sensor();