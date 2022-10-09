/**
 * REGISTER MAPS
 * =====================================================
 * 
 * PDF reference link from WaveShare site.
 * https://www.waveshare.com/w/upload/1/10/Ina219.pdf
 * 
 * Operational Details for INA219 registers:
 * 
 * - Register contents are updated 4 μs after completion of 
 *   the write command.
 * - All INA219 16-bit registers are actually two 8-bit bytes 
 *   through the I2C interface
 * 
 * RPI is little-endian but the results still use BE
 * bit order is 15 -> 0
 * 
 */

/**
 * CONFIGURATION REGISTER
 * PDF REF: Figure 19 pg. 19
 * 
 * BIT 15: Reset Bit 
 *  Set to 1 generates a system reset that is the same as power-on reset
 *  auto-clears.
 * 
 * BIT 13: Bus Voltage Range
 *  0 = 16V FSR
 *  1 = 32V FSR
 * 
 * BIT 11, 12: PGA (Shunt Voltage Only)
 *  default is +8 (320mV range) see PDF pg.19 Table 4. PG Bit Settings
 * 
 * BIT 7-10: BADC Bus ADC resolution/averaging
 *  sets the number of samples used when averaging results for the 
 *  Bus Voltage Register
 *
 * BIT 3-6: SADC Bus ADC resolution/averaging
 *  sets the number of samples used when averaging results for the 
 *  Shunt Voltage Register
 * 
 * BIT 0-2: Operating Mode
 *  defaults to continuous shunt and bus measurement mode
 * 
 */
 export const CONFIGURATION_MAP = {
    LABELS: [
        'RST',
        '-',
        'BRNG',
        'PG1', 'PG0',
        'BADC4', 'BADC3', 'BADC2', 'BADC1',
        'SADC4', 'SADC3', 'SADC2', 'SADC1',
        'MODE3', 'MODE2', 'MODE1'
    ]
}

/**
 * SHUNT VOLTAGE REGISTER
 * PDF REF: Figure 20 - 23 pg. 21
 * 
 * Depends on PGA settings
 * default is +8 (320mV range) see PDF pg.19 Table 4. PG Bit Settings
 * 
 */
export const SHUNT_VOLTAGE_MAP = {
    LABELS_PGA_8: [
        'SIGN',
        'SD14_8', 'SD13_8', 'SD12_8', 'SD11_8',
        'SD10_8', 'SD9_8', 'SD8_8', 'SD7_8',
        'SD6_8', 'SD5_8', 'SD4_8', 'SD3_8',
        'SD2_8', 'SD1_8', 'SD0_8'
    ],
    LABELS_PGA_4: [
        'SIGN',
        'SIGN', 'SD13_4', 'SD12_4', 'SD11_4',
        'SD10_4', 'SD9_4', 'SD8_4', 'SD7_4',
        'SD6_4', 'SD5_4', 'SD4_4', 'SD3_4',
        'SD2_4', 'SD1_4', 'SD0_4'
    ],
    LABELS_PGA_2: [
        'SIGN',
        'SIGN',
        'SIGN',
        'SD12_2', 'SD11_2',
        'SD10_2', 'SD9_2', 'SD8_2', 'SD7_2',
        'SD6_2', 'SD5_2', 'SD4_2', 'SD3_2',
        'SD2_2', 'SD1_2', 'SD0_2'
    ],
    LABELS_PGA_1: [
        'SIGN',
        'SIGN',
        'SIGN',
        'SIGN',
        'SD11_2', 'SD10_2', 'SD9_2', 'SD8_2', 'SD7_2',
        'SD6_2', 'SD5_2', 'SD4_2', 'SD3_2',
        'SD2_2', 'SD1_2', 'SD0_2'
    ],
    VALUE_LABEL: {
        EN: {
            FULL: "milli-volt",
            PLURAL: "milli-volts",
            SHORT: "mV"
        }
    }
}

/**
 * BUS VOLTAGE REGISTER
 * PDF REF: Figure 24 pg. 23
 * 
 * BIT 1: Conversion ready
 *  CNVR is 1 when data from conversion is available at the data registers
 *  reading the Power Register resets this to 0
 * 
 * BIT 0: Math Overflow Flag
 *  OVF is set when Power or Current calculations are out of range
 *  probably need board reset after seeing this
 * 
 */
export const BUS_VOLTAGE_MAP = {
    LABELS: [
        'BD12', 'BD11', 'BD10', 'BD9', 'BD8', 'BD7', 'BD6',
        'BD5', 'BD4', 'BD3', 'BD2', 'BD1', 'BD0',
        '-',
        'CNVR',
        'OVF'
    ],
    VALUE_LABEL: {
        EN: {
            FULL: "volt",
            PLURAL: "volts",
            SHORT: "v"
        }
    }
}

/**
 * POWER REGISTER
 * PDF REF: Figure 25 pg. 23
 * 
 * The Power register records power in watts by multiplying 
 * the values of the current with the value of the bus voltage
 * 
 */
export const POWER_MAP = {
    LABELS: [
        'PD15', 'PD14', 'PD13', 'PD12', 'PD11', 'PD10', 'PD9',
        'PD8', 'PD7', 'PD6', 'PD5', 'PD4', 'PD3', 'PD2', 'PD1', 'PD0'
    ],
    VALUE_LABEL: {
        EN: {
            FULL: "watt",
            PLURAL: "watts",
            SHORT: "w"
        }
    }
}

/**
 * CURRENT REGISTER
 * PDF REF: Figure 26 pg. 23
 * 
 * The value of the Current register is calculated by multiplying 
 * the value in the Shunt Voltage register with the value in 
 * the Calibration register
 * 
 */
export const CURRENT_MAP = {
    LABELS: [
        'CSIGN',
        'CD14', 'CD13', 'CD12', 'CD11', 'CD10', 'CD9', 'CD8', 'CD7', 'CD6',
        'CD5', 'CD4', 'CD3', 'CD2', 'CD1', 'CD0'
    ],
    VALUE_LABEL: {
        EN: {
            FULL: "amp",
            PLURAL: "amps",
            SHORT: "a"
        }
    }
}

/**
 * CALIBRATION REGISTER
 * PDF REF: Figure 27 pg. 24
 * 
 * Current and Power calibration settings. 
 * 
 * BIT 0: void
 *  this bit is not used and cant be set.
 * 
 * BIT 15 - 1: settings
 *  Full scale range, LSB or current and power, and overall system calibration
 * 
 */
export const CALIBRATION_MAP = {
    LABELS: [
        'FS15', 'FS14', 'FS13', 'FS12', 'FS11', 'FS10',
        'FS9', 'FS8', 'FS7', 'FS6', 'FS5', 'FS4', 'FS3',
        'FS2', 'FS1', 'FS0'
    ]
}