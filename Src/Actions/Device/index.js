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

// Wrapper for I2c npm package
import I2CBus from "../../Bus/I2C/index.js";

class Device {
    constructor() {
        this.isInitialized = false;
    };

    /**
     * @method Device#initialize
     * 
     * @summary
     * Initializes the device on the I2C bus
     * 
     * @description
     * Sets up a promisified I2C instance via the 3rd party npm lib
     * 
     * @async
     * @param {Number} i2cAddress value in Hex ie: 0x42
     * @param {Number} busNumber value as INT ie: 1 
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    initialize = async function (i2cAddress, busNumber) {
        let initI2cBus = await I2CBus.initialize(i2cAddress, busNumber);
        if (initI2cBus.success === false) {
            return initI2cBus;
        } else {
            this.isInitialized = true;
            return initI2cBus;
        }
    }

    /**
     * @method Device#getDeviceInformation
     * 
     * @summary
     * Dump of the device info and values
     * 
     * @description
     * Uses the initialized and connected Device to gather system and 
     * device status.
     * 
     * @async
     * @param {Object} Configuration passing in a reference to the Configuration class
     * @param {Object} Calibration passing in a reference to the Calibration class
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getDeviceInformation = async function (Configuration, Calibration) {

        let baseInformation = {
            manufacturer: "WaveShare",
            deviceName: "WaveShare UPS",
            sensor: "ina219",
            type: "Voltage reading",
            isConnected: false
        }

        if (this.isInitialized ) {

            // exit on first error and bubble up error
            let currentConfiguration = await Configuration.getConfiguration();
            if ( !currentConfiguration.success ) return currentConfiguration;

            let currentCalibration = await Calibration.getCalibration();
            if ( !currentCalibration.success ) return currentCalibration;

            // If above is true then we have calculation values
            let currentCalculationValues = await Calibration.getCalculationValues();

            // extra bus data
            let foundDeviceAddresses = await I2CBus.getConnectedDevices();
            if( !foundDeviceAddresses.success ) return foundDeviceAddresses;

            let extendedInformation = baseInformation;
            extendedInformation.isConnected = true;
            extendedInformation.address = I2CBus.i2cAddressAsHex;
            extendedInformation.busNumber = I2CBus.busNumber;
            extendedInformation.configuration = currentConfiguration.data.extended;
            extendedInformation.calibration = currentCalibration.data.extended;
            extendedInformation.calculationValues = currentCalculationValues;
            extendedInformation.busScan = foundDeviceAddresses.data.allAddresses;
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