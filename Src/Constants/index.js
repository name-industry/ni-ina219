/**
 * CONSTANTS
 */


// default 12c address of WaveShare UPS INA219
export const DEFAULT_I2C_ADDRESS = 0x42;

// REGISTERS

// Referenced from PDF, pg 18 Registers
// {label}_{read/write} = Pointer Address in Hex
// ====================================================

export const REGISTERS = {
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

export const CONFIG_SETTINGS = {
    BUS_VOLTAGE_RANGE: {
        RANGE_16V: 0x00, // set bus voltage range to 16V
        RANGE_32V: 0x01  // set bus voltage range to 32V (default)
    },
    GAIN: {
        DIV_1_40MV: 0x00, // shunt prog. gain set to  1, 40 mV range
        DIV_2_80MV: 0x01, // shunt prog. gain set to /2, 80 mV range
        DIV_4_160MV: 0x02,// shunt prog. gain set to /4, 160 mV range
        DIV_8_320MV: 0x03,// shunt prog. gain set to /8, 320 mV range
    },
    BUS_ADC_RESOLUTION: {
        ADCRES_9BIT_1S: 0x00,    //  9bit,   1 sample,     84us
        ADCRES_10BIT_1S: 0x01,   //  10bit,   1 sample,    148us
        ADCRES_11BIT_1S: 0x02,   //  11 bit,  1 sample,    276us
        ADCRES_12BIT_1S: 0x03,   //  12 bit,  1 sample,    532us
        ADCRES_12BIT_2S: 0x09,   //  12 bit,  2 samples,  1.06ms
        ADCRES_12BIT_4S: 0x0A,   //  12 bit,  4 samples,  2.13ms
        ADCRES_12BIT_8S: 0x0B,   //  12bit,   8 samples,  4.26ms
        ADCRES_12BIT_16S: 0x0C,  //  12bit,  16 samples,  8.51ms
        ADCRES_12BIT_32S: 0x0D,  //  12bit,  32 samples, 17.02ms
        ADCRES_12BIT_64S: 0x0E,  //  12bit,  64 samples, 34.05ms
        ADCRES_12BIT_128S: 0x0F, //  12bit, 128 samples, 68.10ms
    },
    SHUNT_ADC_RESOLUTION: {
        ADCRES_9BIT_1S: 0x00,    //  9bit,   1 sample,     84us
        ADCRES_10BIT_1S: 0x01,   //  10bit,   1 sample,    148us
        ADCRES_11BIT_1S: 0x02,   //  11 bit,  1 sample,    276us
        ADCRES_12BIT_1S: 0x03,   //  12 bit,  1 sample,    532us
        ADCRES_12BIT_2S: 0x09,   //  12 bit,  2 samples,  1.06ms
        ADCRES_12BIT_4S: 0x0A,   //  12 bit,  4 samples,  2.13ms
        ADCRES_12BIT_8S: 0x0B,   //  12bit,   8 samples,  4.26ms
        ADCRES_12BIT_16S: 0x0C,  //  12bit,  16 samples,  8.51ms
        ADCRES_12BIT_32S: 0x0D,  //  12bit,  32 samples, 17.02ms
        ADCRES_12BIT_64S: 0x0E,  //  12bit,  64 samples, 34.05ms
        ADCRES_12BIT_128S: 0x0F, //  12bit, 128 samples, 68.10ms
    },
    MODE: {
        POWERDOWN: 0x00, // power down
        SVOLT_TRIGGERED: 0x01, // shunt voltage triggered
        BVOLT_TRIGGERED: 0x02, // bus voltage triggered
        SANDBVOLT_TRIGGERED: 0x03, // shunt and bus voltage triggered
        ADCOFF: 0x04, // ADC off
        SVOLT_CONTINUOUS: 0x05, // shunt voltage continuous
        BVOLT_CONTINUOUS: 0x06, // bus voltage continuous
        SANDBVOLT_CONTINUOUS: 0x07, // shunt and bus voltage continuous
    }
}