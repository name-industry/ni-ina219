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

        ConfigurationService.writeRegister.mockResolvedValue({
            success: true,
            msg: '[I2c Bus] - Bytes written',
            data: { register: 0, value: 16111 }
        });

        const setConfigurationByTemplateIdSpy = jest.spyOn(Configuration, "setConfigurationByTemplateId");
        const result = await Configuration.setConfigurationByTemplateId(templateId);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: setConfigurationByTemplateId ERROR. invalid templateId", async () => {

        // inputs
        let templateId = "32V2A77";

        const setConfigurationByTemplateIdSpy = jest.spyOn(Configuration, "setConfigurationByTemplateId");
        const result = await Configuration.setConfigurationByTemplateId(templateId);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: getConfiguration", async () => {

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
        ConfigurationService.readRegister.mockResolvedValue(mockReadResult);

        // Hydrate actual model
        ConfigurationModel.hydrate(mockReadResult.data, "en", true);

        // Action layer read configuration 
        const result = await Configuration.getConfiguration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

})