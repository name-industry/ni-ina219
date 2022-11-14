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

        // we updated the model and the register return the new calibration values
        if (calibrationUpdated.success === true) {
            // update model values and return them
            CalibrationModel.setActiveTemplate(
                TEMPLATES[templateId]
            );
            return {
                success: true,
                msg: "Calibration register updated",
                data: {
                    template: TEMPLATES[templateId],
                    calculationValues: updatedCalibrationValues
                }
            }
        } else {
            // Error writing register return dto
            return calibrationUpdated;
        }

    }

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

        // we updated the model and the register return the new calibration values
        if (calibrationUpdated.success === true) {
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
        } else {
            // Error writing register return dto
            return calibrationUpdated;
        }
    }

    triggerCalibration = async function () {
        let calculationValues = CalibrationModel.getCalibrationValues();

        let calibrationTriggered = await CalibrationService.writeRegister(
            calculationValues.calculationValue_R
        );

        // we updated the model and the register return the new calibration values
        if (calibrationTriggered.success === true) {
            return {
                success: true,
                msg: "Calibration register triggered",
                data: {
                    template: CalibrationModel.getActiveTemplate(),
                    calculationValues: calculationValues
                }
            }
        } else {
            // Error writing register return dto
            return calibrationTriggered;
        }
    }

    getCalibration = async function () {
        let readResult = await CalibrationService.readRegister();
        if (readResult.success === true) {
            CalibrationModel.hydrate(readResult.data, "en", true);
            return CalibrationModel.getCurrentValues();
        } else {
            return readResult;
        }
    }

    getCalculationValues = function () {
        return CalibrationModel.getCalibrationValues();
    }

}

export default new Calibration();