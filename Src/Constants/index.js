/**
 * CONSTANTS
 * 
 */


// default 12c address of WaveShare UPS INA219
const DEFAULT_I2C_ADDRESS = 0x42;

// Rasp 4B I2c bus active on 1
const DEFAULT_I2C_BUS = 1;

// REGISTERS

// Referenced from PDF, pg 18 Registers
// {label}_{read/write} = Pointer Address in Hex
// ====================================================

const REGISTERS = {
    CONFIG_RW: 0x00, // chip reset/configuration
    SHUNT_VOLTAGE_R: 0x01,// measurement.
    BUS_VOLTAGE_R: 0x02, // measurement. defaults to 0 due to CALIBRATION default to 0
    POWER_R: 0x03, // measurement. defaults to 0 due to CALIBRATION default to 0
    CURRENT_R: 0x04, // current flowing through the shunt resistor
    CALIBRATION_RW: 0x05 // reset or power on defaults to 0
}

// Referenced from PDF, pg 19 Registers
// Address in Hex
// ====================================================

const CONFIGURATION = {
    RESET: {
        TRIGGER: 0x01 // self-clears
    },
    BUS_VOLTAGE_RANGE: {
        RANGE_16V: 0x00, // set bus voltage range to 16V
        RANGE_32V: 0x01  // set bus voltage range to 32V (default)
    },
    GAIN: {
        DIV_1_40MV: 0x00, // shunt prog. gain set to  1, 40 mV range
        DIV_2_80MV: 0x01, // shunt prog. gain set to /2, 80 mV range
        DIV_4_160MV: 0x02,// shunt prog. gain set to /4, 160 mV range
        DIV_8_320MV: 0x03,// shunt prog. gain set to /8, 320 mV range (default)
    },
    // Edited and cross checked 11/10/2022 PDF revised DEC 2015
    // x - denotes not counted can be set to anything
    BUS_ADC_RESOLUTION: {
        // Mode - resolution
        ADCRES_9BIT_1S:    0x00,  //  9  bit,  1 sample,     84us [0 x 0 0]
        ADCRES_10BIT_1S:   0x01,  //  10 bit,  1 sample,    148us [0 x 0 1]
        ADCRES_11BIT_1S:   0x02,  //  11 bit,  1 sample,    276us [0 x 1 0]
        // - next 2 are same according to PDF pg 20 table 5 
        // ADCRES_12BIT_XS is not in other libs 
        ADCRES_12BIT_1S:   0x03,  //  12 bit,  1 sample,    532us [0 x 1 1]
        ADCRES_12BIT_XS:   0x08,  //  12 bit,  ? samples,   532us [1 0 0 0]
        // Samples - assumed 12bit ?
        ADCRES_12BIT_2S:   0x09,  //  12 bit,   2 samples,  1.06ms [1 0 0 1]
        ADCRES_12BIT_4S:   0x0A,  //  12 bit,   4 samples,  2.13ms [1 0 1 0]
        ADCRES_12BIT_8S:   0x0B,  //  12 bit,   8 samples,  4.26ms [1 0 1 1]
        ADCRES_12BIT_16S:  0x0C,  //  12 bit,  16 samples,  8.51ms [1 1 0 0]
        ADCRES_12BIT_32S:  0x0D,  //  12 bit,  32 samples, 17.02ms [1 1 0 1] (default)
        ADCRES_12BIT_64S:  0x0E,  //  12 bit,  64 samples, 34.05ms [1 1 1 0]
        ADCRES_12BIT_128S: 0x0F,  //  12 bit, 128 samples, 68.10ms [1 1 1 1]
    },
    // Note: same values and table for shunt values
    //       duplicated just for completion
    // Edited and cross checked 11/10/2022 PDF revised DEC 2015
    // x - denotes not counted can be set to anything
    SHUNT_ADC_RESOLUTION: {
        // Mode - resolution
        ADCRES_9BIT_1S:    0x00,  //  9  bit,  1 sample,     84us [0 x 0 0]
        ADCRES_10BIT_1S:   0x01,  //  10 bit,  1 sample,    148us [0 x 0 1]
        ADCRES_11BIT_1S:   0x02,  //  11 bit,  1 sample,    276us [0 x 1 0]
        // - next 2 are same according to PDF pg 20 table 5 
        // ADCRES_12BIT_XS is not in other libs 
        ADCRES_12BIT_1S:   0x03,  //  12 bit,  1 sample,    532us [0 x 1 1]
        ADCRES_12BIT_XS:   0x08,  //  12 bit,  ? samples,   532us [1 0 0 0]
        // Samples - assumed 12bit ?
        ADCRES_12BIT_2S:   0x09,  //  12 bit,   2 samples,  1.06ms [1 0 0 1]
        ADCRES_12BIT_4S:   0x0A,  //  12 bit,   4 samples,  2.13ms [1 0 1 0]
        ADCRES_12BIT_8S:   0x0B,  //  12 bit,   8 samples,  4.26ms [1 0 1 1]
        ADCRES_12BIT_16S:  0x0C,  //  12 bit,  16 samples,  8.51ms [1 1 0 0]
        ADCRES_12BIT_32S:  0x0D,  //  12 bit,  32 samples, 17.02ms [1 1 0 1] (default)
        ADCRES_12BIT_64S:  0x0E,  //  12 bit,  64 samples, 34.05ms [1 1 1 0]
        ADCRES_12BIT_128S: 0x0F,  //  12 bit, 128 samples, 68.10ms [1 1 1 1]
    },
    MODE: {
        POWERDOWN: 0x00, // power down apply it to bits 2,1,0 in the register 
        SVOLT_TRIGGERED: 0x01, // shunt voltage triggered
        BVOLT_TRIGGERED: 0x02, // bus voltage triggered
        SANDBVOLT_TRIGGERED: 0x03, // shunt and bus voltage triggered
        ADCOFF: 0x04, // ADC off
        SVOLT_CONTINUOUS: 0x05, // shunt voltage continuous
        BVOLT_CONTINUOUS: 0x06, // bus voltage continuous
        SANDBVOLT_CONTINUOUS: 0x07, // shunt and bus voltage continuous (default)
    }
}

/**
 * Calibration Templates
 * Note: DEFAULT used for resetting the chip to defaults
 *       same as power on values
 */
const CALIBRATION_TEMPLATES = {
    "IDS": ["DEFAULT", "32V2A"],
    "DEFAULT": { // 00111001 10011111
        // todo remove these
        currentDivider_mA: 10,
        powerDivider_mW: 2,
        // Req
        calValue: 4096,
        currentLSB: 0.1, // Current LSB = 100uA per bit
        powerLSB: 0.002, // Power LSB = 2mW per bit
        // set bits
        config: CONFIGURATION.RESET.TRIGGER << 15
    },
    "32V2A": { // 00111110 11101111
        // todo remove these
        currentDivider_mA: 10,
        powerDivider_mW: 2,
        // Req
        calValue: 4096,
        currentLSB: 0.1, // Current LSB = 100uA per bit
        powerLSB: 0.002, // Power LSB = 2mW per bit
        // set bits
        config: 
            CONFIGURATION.BUS_VOLTAGE_RANGE.RANGE_32V << 13 |
            CONFIGURATION.GAIN.DIV_8_320MV << 11 |
            CONFIGURATION.BUS_ADC_RESOLUTION.ADCRES_12BIT_32S << 7 |
            CONFIGURATION.SHUNT_ADC_RESOLUTION.ADCRES_12BIT_32S << 3 |
            CONFIGURATION.MODE.SANDBVOLT_CONTINUOUS
    }
}

export const Constants = {
    DEFAULT_I2C_ADDRESS: DEFAULT_I2C_ADDRESS,
    DEFAULT_I2C_BUS: DEFAULT_I2C_BUS,
    REGISTERS: REGISTERS,
    CONFIGURATION: CONFIGURATION,
    CALIBRATION_TEMPLATES: CALIBRATION_TEMPLATES
}