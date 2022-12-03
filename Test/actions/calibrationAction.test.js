import CalibrationModel from "../../Src/Domain/Calibration/Model/index.js";
import CalibrationService from "../../Src/Domain/Calibration/Service/index.js";

// import { TEMPLATES } from "../../Src/Constants/index.js";
import Calibration from "../../Src/Actions/Calibration/index.js";

// jest.mock("../../Src/Domain/Configuration/Model/index.js")
jest.mock("../../Src/Domain/Calibration/Service/index.js");

describe("[Action Layer] Suite - Calibration", () => {

    beforeEach(() => {
    });

    afterEach(() => {
        // jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    test("- method: setConfigurationByTemplateId", async () => {

        // inputs
        let templateId = "32V2A";

        CalibrationService.writeRegister.mockResolvedValue({
            success: true,
            msg: '[I2c Bus] - Bytes written',
            data: { register: 0, value: 16111 }
        });

        const setCalibrationByTemplateIdSpy = jest.spyOn(Calibration, "setCalibrationByTemplateId");
        const result = await Calibration.setCalibrationByTemplateId(templateId);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: setCalibrationByTemplateId ERROR. invalid templateId", async () => {

        // inputs
        let templateId = "32V2A77";

        const setCalibrationByTemplateIdSpy = jest.spyOn(Calibration, "setCalibrationByTemplateId");
        const result = await Calibration.setCalibrationByTemplateId(templateId);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: getCalibration", async () => {

        let mockReadResult = {
            success: true,
            msg: '[I2c Bus] - Bytes read',
            data: {
                bytesRead: 2,
                buffer: Buffer.alloc(2, 0, "utf-8"),
                payload: 16111
            }
        }

        // Mock read
        CalibrationService.readRegister.mockResolvedValue(mockReadResult);

        // Hydrate actual model
        CalibrationModel.hydrate(mockReadResult.data, "en", true);

        // Action layer read configuration 
        const result = await Calibration.getCalibration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: setCustomCalibration", async () => {

        CalibrationService.writeRegister.mockResolvedValue({
            success: true,
            msg: '[I2c Bus] - Bytes written',
            data: { register: 0, value: 16111 }
        });

        let calculationValues = {
            currentLSB: 0.00009765625,
            currentLSB_R: 0.0001,
            powerLSB: 0.001953125,
            calculationValue: 4194,
            calculationValue_R: 4096
        }

        const writeRegisterSpy = jest.spyOn(CalibrationService, "writeRegister");
        const writeResult = await CalibrationService.writeRegister(calculationValues.calculationValue_R);

        const setCustomCalibrationSpy = jest.spyOn(Calibration, "setCustomCalibration");
        const result = await Calibration.setCustomCalibration(
            32,     // busVoltageMax
            0.1,    // shuntResistanceOhms
            0.32,   // gainVoltage
            1.6    // currentMaxExpected
        );

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: triggerCalibration", async () => {

        CalibrationService.writeRegister.mockResolvedValue({
            success: true,
            msg: '[I2c Bus] - Bytes written',
            data: { register: 0, value: 16111 }
        });

        let calculationValues = {
            currentLSB: 0.00009765625,
            currentLSB_R: 0.0001,
            powerLSB: 0.001953125,
            calculationValue: 4194,
            calculationValue_R: 4096
        }

        const writeRegisterSpy = jest.spyOn(CalibrationService, "writeRegister");
        const writeResult = await CalibrationService.writeRegister(calculationValues.calculationValue_R);

        const triggerCalibrationSpy = jest.spyOn(Calibration, "triggerCalibration");
        const result = await Calibration.triggerCalibration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

})