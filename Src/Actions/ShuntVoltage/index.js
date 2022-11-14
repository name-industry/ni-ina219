// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class ShuntVoltage
 * 
 * @summary 
 * ShuntVoltage Actions
 * 
 * @description 
 * Actions for the Shunt Voltage register on the INA219 
 */

 import ShuntVoltageModel from "../../Domain/ShuntVoltage/Model/index.js";
 import ShuntVoltageService from "../../Domain/ShuntVoltage/Service/index.js";
 
 
 class ShuntVoltage {
     constructor() { };
 
     getShuntVoltage = async function () {
         let readResult = await ShuntVoltageService.readRegister();
         if (readResult.success === true) {
             ShuntVoltageModel.hydrate(readResult.data, "en", true);
             return ShuntVoltageModel.getCurrentValues();
         } else {
             return readResult;
         }
     }
 }
 
 export default new ShuntVoltage();