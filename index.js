import i2c from 'i2c-bus';

const INA219_ADDRESS = 0x40;
const INA219_REG_CONFIG = 0x00;
const INA219_CONFIG_BVOLTAGERANGE_32V = 0x2000;
const INA219_CONFIG_GAIN_8_320MV = 0x1800;
const INA219_CONFIG_BADCRES_12BIT = 0x0400;
const INA219_CONFIG_SADCRES_12BIT_1S_532US = 0x0018;
const INA219_CONFIG_MODE_SANDBVOLT_CONTINUOUS = 0x0007;
const INA219_REG_SHUNTVOLTAGE = 0x01;
const INA219_REG_BUSVOLTAGE = 0x02;
const INA219_REG_CURRENT = 0x04;
const INA219_REG_CALIBRATION = 0x05;

class INA219_sensor {

    constructor() {
        this.currentDivider_mA = 0;
        this.powerDivider_mW = 0;
        this.calValue = 0;
    }

    init = function (i2cAddress = INA219_ADDRESS, busNumber = 1) {
        this.i2cAddress = i2cAddress;
        this.busNumber = busNumber;
        this.wire = i2c.openSync(this.busNumber);
    }

    writeRegister = function (register, value, callback) {
        let bytes = Buffer.alloc(2);
        bytes[0] = (value >> 8) & 0xFF;
        bytes[1] = value & 0xFF
        this.wire.writeI2cBlockSync(this.i2cAddress, register, 2, bytes);
        callback(null);
    }

    readRegister = function (register, callback) {
        let res = Buffer.alloc(2);
        this.wire.readI2cBlockSync(this.i2cAddress, register, 2, res);
        let value = res.readInt16BE();
        callback(value);
    }

    calibrate32V2A = function (callback) {
        this.calValue = 4096;
        this.currentDivider_mA = 10;
        this.powerDivider_mW = 2;
        let $this = this;
        this.writeRegister(INA219_REG_CALIBRATION, this.calValue, function (err) {
            var config = INA219_CONFIG_BVOLTAGERANGE_32V |
                INA219_CONFIG_GAIN_8_320MV |
                INA219_CONFIG_BADCRES_12BIT |
                INA219_CONFIG_SADCRES_12BIT_1S_532US |
                INA219_CONFIG_MODE_SANDBVOLT_CONTINUOUS;
            $this.writeRegister(INA219_REG_CONFIG, config, function (err) {
                callback();
            });
        });
    }

    getBusVoltage_raw = function (callback) {
        this.readRegister(INA219_REG_BUSVOLTAGE, function (value) {
            callback((value >> 3) * 4);
        });
    }

    getShuntVoltage_raw = function (callback) {
        this.readRegister(INA219_REG_SHUNTVOLTAGE, function (value) {
            callback(value);
        });
    }

    getCurrent_raw = function (callback) {
        let $this = this;
        this.writeRegister(INA219_REG_CALIBRATION, this.calValue, function (err) {
            $this.readRegister(INA219_REG_CURRENT, function (value) {
                callback(value);
            });
        });
    }

    getBusVoltage_V = function (callback) {

        this.getBusVoltage_raw(function (result) {
            callback(result * 0.001);
        });

    }

    getShuntVoltage_mV = function (callback) {
        this.getShuntVoltage_raw(function (result) {
            callback(result * 0.01);
        });
    }

    getCurrent_mA = function (callback) {
        let $this = this;
        this.getCurrent_raw(function (value) {
            callback(value / $this.currentDivider_mA);
        });
    }

}

export default new INA219_sensor();
