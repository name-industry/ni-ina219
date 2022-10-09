// Texas Instruments INA219 Zero-Drift Bi-Directional
// Current/Power monitor with I2c interface.
// https://www.waveshare.com/w/upload/1/10/Ina219.pdf
// 
// testing with 2x NCR18650B 18650 Battery
// Panasonic-Japan 3400mAh Li-ion 3.7V Flat Top Rechargeable [3.6 <> 4.2 cutoff 2.5]
// https://www.orbtronic.com/content/NCR18650B-Datasheet-Panasonic-Specifications.pdf

import i2c from 'i2c-bus';
import {
    DEFAULT_I2C_ADDRESS,
    REGISTERS,
    CONFIG_SETTINGS
} from "./Src/Constants/index.js";

import {
    // CONFIGURATION_MAP,
    SHUNT_VOLTAGE_MAP,
    BUS_VOLTAGE_MAP,
    POWER_MAP,
    CURRENT_MAP,
    // CALIBRATION_MAP
} from "./Src/Maps/index.js";

class INA219_sensor {

    constructor() {
        this.currentDivider_mA = 0;
        this.powerDivider_mW = 0;
        this.calValue = 0;
    }

    /**
     * @param {*} i2cAddress 
     * @param {*} busNumber 
     */
    init = function (i2cAddress = DEFAULT_I2C_ADDRESS, busNumber = 1) {
        this.i2cAddress = i2cAddress;
        this.busNumber = busNumber;
        this.wire = i2c.openSync(this.busNumber);
    }

    formatRegisterOutput = function (cmd, labelMap, buf, len) {
        let result = [];
        let byte0 = buf[0].toString(2).padStart(8, "0");
        let byte1 = buf[1].toString(2).padStart(8, "0");
        let bitArray = byte0.split("").concat(byte1.split(""));
        let mappedBitValues = bitArray.map((v, i) => {
            return labelMap[i] + ":" + v;
        })

        for (let i = 0; i < len; i++) {
            // unshift to pop it the other way
            result.push(buf[i].toString(2).padStart(8, "0"));
        }
        return {
            // string: result.join(" "),
            cmd: cmd,
            mappedBitValues: mappedBitValues,
            manualBytesToString: byte0 + byte1,
            integer: parseInt(byte0 + byte1, 2)
        }
    }

    writeRegister = async function (register, value) {
        let bytes = Buffer.alloc(2);
        bytes[0] = (value >> 8) & 0xFF;
        bytes[1] = value & 0xFF
        let bytesWritten = this.wire.writeI2cBlockSync(this.i2cAddress, register, 2, bytes);
        return {};
    }

    /**
     * Registers are 16 bits. 
     * Read a Block at once via SMBus. Upto 32Bytes
     * Requires the I2c Address in Hex for the device
     * Requires the Register Pointer in Hex ( where to read )
     * Requires the length as an INT for total bytes to read back up to 32 Bytes
     * Requires a buffer with minimum = to length where results are places.
     * 
     * Example:
     *  I2C_ADDRESS = 0x40;
     *  REG_BUS_VOLTAGE_R = 0x02;
     *  length = 2; // because INA219's 16 bit 2 byte size block
     *  
     * Notes: 
     * 
     *  In node we can allocate a buffer with a size and type and default values.
     *  I am not sure what the underlying wrappers to the main SMBus returns.
     * 
     * Raspberry Pi -> lscpu | grep -i endian
     *  returns Little Endian also double check
     * echo -en \\001\\002 | od -An -tx2
     *  0201  # little-endian <- returns
     *  0102  # big-endian
     * 
     *  // 16-bit signed integer from the buffer
        // defaults to zero. NODE inbuilt reading Big End.
        // callback(resultBuffer.readInt16BE(0));
        // At full-scale range = 32 V (decimal = 8000, hex = 1F40), and LSB = 4 mV.

     * @param {*} register 
     */
    readRegister = async function (register) {
        // let resultBuffer = Buffer.alloc(2, 0, "binary"); ???
        let resultBuffer = Buffer.alloc(2, 0, "utf-8");
        let bytesRead = this.wire.readI2cBlockSync(this.i2cAddress, register, 2, resultBuffer);
        return {
            bytesRead: bytesRead,
            buffer: resultBuffer,
            payload: resultBuffer.readInt16BE(0, 2)
        }
    }

    calibrate32V2A = async function () {

        this.currentDivider_mA = 10;
        this.powerDivider_mW = 2;

        this.calValue = 4096;
        this.currentLSB = 0.1; // Current LSB = 100uA per bit
        this.powerLSB = .002; // Power LSB = 2mW per bit

        // start calibration call
        let writeCalibration = await this.writeRegister(REGISTERS.CALIBRATION_RW, this.calValue);

        this.config =
            CONFIG_SETTINGS.BUS_VOLTAGE_RANGE.RANGE_32V << 13 |
            CONFIG_SETTINGS.GAIN.DIV_8_320MV << 11 |
            CONFIG_SETTINGS.BUS_ADC_RESOLUTION.ADCRES_12BIT_32S << 7 |
            CONFIG_SETTINGS.SHUNT_ADC_RESOLUTION.ADCRES_12BIT_32S << 3 |
            CONFIG_SETTINGS.MODE.SANDBVOLT_CONTINUOUS;

        // write out configuration
        let writeConfiguration = await this.writeRegister(REGISTERS.CONFIG_RW, this.config);

        return {
            writeCalibration: writeCalibration,
            writeConfiguration: writeConfiguration
        }
    }

    getBusVoltage = async function () {
        let prep = await this.writeRegister(REGISTERS.CALIBRATION_RW, this.calValue);
        let data = await this.readRegister(REGISTERS.BUS_VOLTAGE_R);
        let output = this.formatRegisterOutput("BUS_VOLTAGE", BUS_VOLTAGE_MAP.LABELS, data.buffer, data.bytesRead);
        output.asFloat = (data.payload >> 3) * 0.004;
        return output;
    }

    getShuntVoltage = async function () {
        let prep = await this.writeRegister(REGISTERS.CALIBRATION_RW, this.calValue);
        let data = await this.readRegister(REGISTERS.SHUNT_VOLTAGE_R);
        let output = this.formatRegisterOutput("SHUNT_VOLTAGE", SHUNT_VOLTAGE_MAP.LABELS_PGA_8, data.buffer, data.bytesRead);
        output.asFloat = data.payload * 0.01 / 1000;
        return output;
    }

    getPower = async function () {
        let prep = await this.writeRegister(REGISTERS.CALIBRATION_RW, this.calValue);
        let data = await this.readRegister(REGISTERS.POWER_R);
        let output = this.formatRegisterOutput("POWER", POWER_MAP.LABELS, data.buffer, data.bytesRead);
        output.asFloat = data.payload * this.powerLSB;
        return output;
    }

    getCurrent = async function () {
        let prep = await this.writeRegister(REGISTERS.CALIBRATION_RW, this.calValue);
        let data = await this.readRegister(REGISTERS.CURRENT_R);
        let output = this.formatRegisterOutput("CURRENT", CURRENT_MAP.LABELS, data.buffer, data.bytesRead);
        output.asFloat = data.payload * this.currentLSB / 1000;
        return output;
    }

}

export default new INA219_sensor();