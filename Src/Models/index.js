/**
 * Models / Chip Register Maps
 * 
 * @summary
 * PDF [reference link from WaveShare]{@link https://www.waveshare.com/w/upload/1/10/Ina219.pdf} site
 * 
 * @description
 * Operational Details for INA219 registers:
 * <br /><br />
 * - Register contents are updated 4 μs after completion of 
 *   the write command.<br />
 * - All INA219 16-bit registers are actually two 8-bit bytes 
 *   through the I2C interface
 * <br /><br />
 * RPI is little-endian but the results still use BE
 * <br />
 * Bit order is 15 -> 0
 */

 import ConfigurationModel from "./ConfigurationModel.js";
 import CalibrationModel from "./CalibrationModel.js";
 import BusVoltageModel from "./BusVoltageModel.js";
 import ShuntVoltageModel from "./ShuntVoltageModel.js";
 import PowerModel from "./PowerModel.js";
 import CurrentModel from "./CurrentModel.js";
 import PowerSupplyModel from "./PowerSupplyModel.js";
 
 export const Models = {
     configuration: ConfigurationModel,
     calibration: CalibrationModel,
     busVoltage: BusVoltageModel,
     shuntVoltage: ShuntVoltageModel,
     power: PowerModel,
     current: CurrentModel,
     powerSupplyModel: PowerSupplyModel
 }