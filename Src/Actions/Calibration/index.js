// V@ts-check <- has problems with 'this' in the init method for some reason
/**
 * @class Calibration
 * 
 * @summary 
 * Calibration Actions
 * 
 * @description 
 * Actions for the Calibration register on the INA219 
 */

import { TEMPLATES } from "../../Constants/index.js";

import CalibrationModel from "../../Domain/Calibration/Model/index.js";
import CalibrationService from "../../Domain/Calibration/Service/index.js";


class Calibration {
    constructor() { };

    /**
     * @method Calibration#setCalibrationByTemplate
     * 
     * @summary
     * Sets INA219 Calibration by its templateId
     * 
     * @description 
     * Set the calibration register by using a provided template. All
     * templates are found in the Constants file currently. If no 
     * templateId is provided the default template "32V2A" is used 
     * which is a slight change from th INA219 Power on defaults.
     * 
     * @param {String} templateId the templateId from Constants ie: "32V2A"
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    setCalibrationByTemplateId = async function (templateId = "32V2A") {

        // is a valid template id
        if (!TEMPLATES.IDS.includes(templateId)) {
            return {
                success: false,
                msg: "Unknown configuration template Id",
                data: {
                    requestedId: templateId
                }
            };
        }

        // Update model and create calculation values
        let updatedCalibrationValues = CalibrationModel.setCustomCalibrationValues(
            TEMPLATES[templateId].busVoltageMax,
            TEMPLATES[templateId].shuntResistanceOhms,
            TEMPLATES[templateId].gainVoltage,
            TEMPLATES[templateId].currentMaxExpected
        );

        // update Register with new rounded calculation value
        let calibrationUpdated = await CalibrationService.writeRegister(
            updatedCalibrationValues.calculationValue_R
        );

        // error writing to register
        if (!calibrationUpdated.success) return calibrationUpdated;

        // set active calibration values
        CalibrationModel.setActiveTemplate(
            TEMPLATES[templateId]
        );

        // return DTO
        return {
            success: true,
            msg: "Calibration register updated",
            data: {
                template: TEMPLATES[templateId],
                calculationValues: updatedCalibrationValues
            }
        }

    }

    /**
     * @method Calibration#setCustomCalibration
     * 
     * @summary
     * set custom calibration values
     * 
     * @description
     * Opens up the calibration register for advanced usage. You can 
     * can use the Constants file exposed to create any calibration values
     * and have them stored on the register. This is for uses outside the
     * Templates where you need to fine tune the measured results returned
     * via the public interface calls. Setting these randomly will not 
     * do much as they should be properly matched to the configuration
     * register inputs.  
     * 
     * @async
     * @param {Number} busVoltageMax 
     * @param {Number} shuntResistanceOhms 
     * @param {Number} gainVoltage 
     * @param {Number} currentMaxExpected 
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto
     */
    setCustomCalibration = async function (
        busVoltageMax,
        shuntResistanceOhms,
        gainVoltage,
        currentMaxExpected
    ) {
        // Update model and create calculation values
        let updatedCalibrationValues = CalibrationModel.setCustomCalibrationValues(
            busVoltageMax,
            shuntResistanceOhms,
            gainVoltage,
            currentMaxExpected
        );

        // update Register with new rounded calculation value
        let calibrationUpdated = await CalibrationService.writeRegister(
            updatedCalibrationValues.calculationValue_R
        );

        if (!calibrationUpdated.success) return calibrationUpdated;

        // update model values and return them
        CalibrationModel.setActiveTemplate();
        return {
            success: true,
            msg: "Calibration register updated",
            data: {
                template: undefined,
                calculationValues: updatedCalibrationValues
            }
        }
    }

    /**
     * @method Calibration#triggerCalibration
     * 
     * @summary
     * Trigger a calibration register write
     * 
     * @description
     * Takes the current calibration register and re-writes it to 
     * the register. Forces a calculation. Is a helper action in case
     * an action requires another write to force a calculation to 
     * happen.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto 
     */
    triggerCalibration = async function () {
        let calculationValues = CalibrationModel.getCalibrationValues();

        let calibrationTriggered = await CalibrationService.writeRegister(
            calculationValues.calculationValue_R
        );

        if (!calibrationTriggered.success) return calibrationTriggered;

        // we updated the model and the register return the new calibration values
        return {
            success: true,
            msg: "Calibration register triggered",
            data: {
                template: CalibrationModel.getActiveTemplate(),
                calculationValues: calculationValues
            }
        }
    }

    /**
     * @method Calibration#getCalibration
     * 
     * @summary
     * Reads the Calibration register
     * 
     * @description
     * Basic read of the calibration register. Non-cached. Currently
     * there are no cached reads implemented in the Module.
     * 
     * @async
     * @returns {Promise<(ResultObject|ErrorResultObject)>}  returns dto 
     */
    getCalibration = async function () {
        let readResult = await CalibrationService.readRegister();

        // error reading from register
        if (!readResult.success) return readResult;

        CalibrationModel.hydrate(readResult.data, "en", true);

        return {
            success: true,
            msg: "Calibration",
            data: CalibrationModel.getCurrentValues()
        }

    }

    /**
     * @method Calibration#getCalculationValues
     * 
     * @summary
     * Gets the calculation values from the model
     * 
     * @description
     * Helper method to get the calculation numbers back from the 
     * CalibrationModel. For example: powerLSB, currentLSB
     * 
     * @returns {Object}  returns dto 
     */
    getCalculationValues = function () {
        return CalibrationModel.getCalibrationValues();
    }

}

export default new Calibration();