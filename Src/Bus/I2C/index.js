/**
 * @class I2cBus
 * 
 * @summary
 * Temporary included I2c-Bus wrapper
 * 
 * @description
 * Notes: 
 * <br /><br />
 *  In node we can allocate a buffer with a size and type and default values.
 *  I am not sure what the underlying wrappers to the main SMBus returns.
 * <br /><br />
 * Raspberry Pi -> lscpu | grep -i endian<br />
 *  returns Little Endian also double check<br />
 *  echo -en \\001\\002 | od -An -tx2<br />
 *  0201  # little-endian <- returns<br />
 *  0102  # big-endian<br />
 */

import i2c from 'i2c-bus';

class I2CBus {

    /** @type {Number} */
    i2cAddress = 66; // UPS Hat address

    /** @type {Object | Undefined} */
    wire = undefined;
    
    /** @type {Number} */
    busNumber = 1; // default on PI "/dev/i2c-1"
    
    /** @type {String} */
    i2cAddressAsHex = "0x42"; // UPS Hat address

    /**
     * @method I2cBus#initialize
     * 
     * @description
     * Please note i2c-bus lib allows you to connect to any
     * bus number as long as its an INT. So the returned
     * bus object does not fail/error on "open" of an arbitrary
     * hardware bus line.
     * 
     * @param {Number} i2cAddress Address in hex of the sensor ie: 0x42 || 66 
     * @param {Number} busNumber The Bus address as an integer ie: 1 ( for PI ) 
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    initialize = async function (
        i2cAddress = 0x42, // note: JS passes around and displays Decimal
        busNumber = 1,
        options = {}
    ) {
        let wire;
        try {
            wire = await i2c.openPromisified(busNumber, options).then(wire => wire);
        } catch (error) {
            return {
                success: false,
                msg: "[I2c] - Error on open I2CBus",
                data: {
                    errorMessage: error.stack.split("\n")[0],
                    errorStack: error
                }
            }
        }

        // I2C_Bus docs do not say anything about scan being Promises
        // but wire.scan returns a promise.
        // TODO: set timer prior to calling this.
        //       on occasion the bus hangs the underlying request 
        //       can lock up the program ( PI )
        let addressFound = await wire.scan(i2cAddress);

        // delay

        // Sometimes a sensor is in sleep mode ( not the UPS Hat )
        // so we can pause and re-scan again ( a scan can trigger a wake up 
        // making the sensor visible on I2c )
        addressFound = await wire.scan(i2cAddress);

        if (addressFound.length === 0) {
            return {
                success: false,
                msg: "[I2c] - No device found",
                data: {
                    wire: wire,
                    i2cAddressRequested: "0x" + i2cAddress.toString(16)
                }
            }
        } else {

            this.setCurrentBusData(i2cAddress, wire, busNumber, "0x" + i2cAddress.toString(16));

            return {
                success: true,
                msg: "[I2c] - Ready",
                data: {
                    wire: wire,
                    busNumber: busNumber,
                    i2cAddressAsHex: "0x" + i2cAddress.toString(16)
                }
            }
        }
    }

    /**
     * @method I2cBus#setCurrentBusData
     * 
     * @summary 
     * Class setter for keeping track of the current bus settings
     * 
     * @param {Number} i2cAddress 
     * @param {Object} wire 
     * @param {Number} busNumber 
     * @param {String} i2cAddressAsHex 
     */
    setCurrentBusData = function (i2cAddress, wire, busNumber, i2cAddressAsHex) {
        this.i2cAddress = i2cAddress;
        this.wire = wire;
        this.busNumber = busNumber;
        this.i2cAddressAsHex = i2cAddressAsHex;
    }

    /**
     * @method I2cBus#getConnectedDevices
     * 
     * @summary 
     * Expose bus scan in the odd case its needed
     * 
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    getConnectedDevices = async function () {
        // active + asleep
        let allAddressesFound = await wire.scan();
        
        // delay

        // active ( waking up asleep )
        allAddressesFound = await wire.scan();

        if (allAddressesFound.length === 0) {
            return {
                success: false,
                msg: "[I2c] - No devices found",
                data: {}
            }
        } else {
            return {
                success: true,
                msg: "[I2c] - All devices on bus",
                data: {
                    allAddresses: allAddressesFound.map((v, i) => { return "0x" + v.toString(16) })
                }
            }
        }
    }

    /**
     * @method I2cBus#readRegister
     * 
     * @summary
     * Returns bytesRead and the hydrated buffer on success 
     * 
     * @description
     * Registers are 16 bits. 2 bytes.
     * Requires the I2c register address in Hex to read from
     * 
     * @param {Number} register address in hex of the register to read from ie: 0x01 
     * @returns {Promise<(ResultObject|ErrorResultObject)>} returns value object 
     */
    readRegister = async function (register) {

        let resultBuffer = Buffer.alloc(2, 0, "utf-8");
        let data;

        try {
            data = await this.wire.readI2cBlock(this.i2cAddress, register, 2, resultBuffer);
        } catch (error) {
            return {
                success: false,
                msg: "[I2c Bus] - Read Error",
                data: {
                    errorName: error.name,
                    errorMessage: error.message
                }
            }
        }

        return {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesRead: data.bytesRead,
                buffer: data.buffer,
                payload: data.buffer.readInt16BE(0, 2)
            }
        }
    }

    /**
     * @method I2cBus#writeRegister 
     * 
     * @param {Number} register address in hex of the register to write to ie: 0x04 
     * @param {Number} value the new value to be written to the register
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns value object 
     */
    writeRegister = async function (register, value) {

        let bytes = Buffer.alloc(22, 0, "utf-8"); // why is this not "binary"
        bytes[0] = (value >> 8) & 0xFF;
        bytes[1] = value & 0xFF;

        let data;

        try {
            data = await this.wire.writeI2cBlock(this.i2cAddress, register, 2, bytes);
        } catch (error) {
            return {
                success: false,
                msg: "[I2c Bus] - Write Error",
                data: {
                    errorName: error.name,
                    errorMessage: error.message
                }
            }
        }

        return {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                register: register,
                value: value
            }
        }
    }

}

export default new I2CBus();