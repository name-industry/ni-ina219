// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class Device
 * 
 * @summary 
 * Device Actions
 * 
 * @description 
 * Actions for the WaveShare UPS device
 */

// import BusVoltageModel from "../../Domain/BusVoltage/Model/index.js";
// import BusVoltageService from "../../Domain/BusVoltage/Service/index.js";

// Wrapper for I2c npm package
import I2CBus from "../../Bus/I2C/index.js";

class Device {
    constructor() {
        this.isInitialized = false;
    };

    initialize = async function (i2cAddress, busNumber) {
        let initI2cBus = await I2CBus.initialize(i2cAddress, busNumber);
        if (initI2cBus.success === false) {
            return initI2cBus;
        } else {
            this.isInitialized = true;
            return initI2cBus;
        }
    }

    getDeviceInformation = async function (Configuration, Calibration) {

        let baseInformation = {
            manufacturer: "WaveShare",
            deviceName: "WaveShare UPS",
            sensor: "ina219",
            type: "Voltage reading"
        }

        if (this.isInitialized === true) {

            let currentConfiguration = await Configuration.getConfiguration();
            let currentCalibration = await Calibration.getCalibration();
            let currentCalculationValues = await Calibration.getCalculationValues();

            let extendedInformation = baseInformation;
            extendedInformation.isConnected = true;
            extendedInformation.address = I2CBus.i2cAddressAsHex;
            extendedInformation.busNumber = I2CBus.busNumber;
            extendedInformation.configuration = currentConfiguration.extended;
            extendedInformation.calibration = currentCalibration.extended;
            extendedInformation.calculationValues = currentCalculationValues;
            return {
                success: true,
                msg: "getDeviceInformation - isConnected",
                data: extendedInformation
            }

        } else {
            return {
                success: true,
                msg: "getDeviceInformation - not initialized",
                data: baseInformation
            }
        }
    }
}

export default new Device();