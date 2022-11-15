import NI_INA219 from "../index";
import I2CBus from "../Src/Bus/I2C/index.js";

// Mocking the I2C bus wrapper for the 3rd party module
jest.mock('../Src/Bus/I2C/index.js');

// Mocking Actions layer
import Device from "../Src/Actions/Device/index.js";
import Configuration from "../Src/Actions/Configuration/index.js";
import Calibration from "../Src/Actions/Calibration/index.js";

jest.mock("../Src/Actions/Device/index.js");
jest.mock("../Src/Actions/Configuration/index.js");
jest.mock("../Src/Actions/Calibration/index.js");

describe("[./Src/NI_INA.js] Suite - Method return shape testing", () => {

    beforeEach(() => {
    });

    afterEach(() => {
        // jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    test("- method: initialize", async () => {

        Device.initialize.mockResolvedValue({
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesWritten: 2
            }
        });

        const setConfigurationByTemplateIdSpy = jest.spyOn(NI_INA219, "setConfigurationByTemplateId");
        setConfigurationByTemplateIdSpy.mockReturnValue({
            success: true,
            msg: "[Update] - Configuration and Calibration updated",
            data: {
                configuration: {
                    busVoltageMax: 32,
                    shuntResistanceOhms: 0.1,
                    gainVoltage: 0.32,
                    currentMaxExpected: 3.2,
                    registerAsDecimal: 16111,
                    config: 16111
                },
                calibration: {
                    currentLSB: 0.00009765625,
                    currentLSB_R: 0.0001,
                    powerLSB: 0.001953125,
                    calculationValue: 4194,
                    calculationValue_R: 4096
                }
            }
        });

        const initializeSpy = jest.spyOn(NI_INA219, "initialize");
        const result = await NI_INA219.initialize();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    });

    test("- method: initialize ERROR. Bus", async () => {

        Device.initialize.mockResolvedValue({
            success: false,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesWritten: 2
            }
        });

        const setConfigurationByTemplateIdSpy = jest.spyOn(NI_INA219, "setConfigurationByTemplateId");
        setConfigurationByTemplateIdSpy.mockReturnValue({
            success: true,
            msg: "[Update] - Configuration and Calibration updated",
            data: {
                configuration: {
                    busVoltageMax: 32,
                    shuntResistanceOhms: 0.1,
                    gainVoltage: 0.32,
                    currentMaxExpected: 3.2,
                    registerAsDecimal: 16111,
                    config: 16111
                },
                calibration: {
                    currentLSB: 0.00009765625,
                    currentLSB_R: 0.0001,
                    powerLSB: 0.001953125,
                    calculationValue: 4194,
                    calculationValue_R: 4096
                }
            }
        });

        const initializeSpy = jest.spyOn(NI_INA219, "initialize");
        const result = await NI_INA219.initialize();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: initialize ERROR. Update Configuration", async () => {

        Device.initialize.mockResolvedValue({
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesWritten: 2
            }
        });

        const setConfigurationByTemplateIdSpy = jest.spyOn(NI_INA219, "setConfigurationByTemplateId");
        setConfigurationByTemplateIdSpy.mockResolvedValue({
            success: false,
            msg: "[I2c Bus] - Write Error",
            data: {
                errorName: "",
                errorMessage: ""
            }
        });

        const initializeSpy = jest.spyOn(NI_INA219, "initialize");
        const result = await NI_INA219.initialize();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: getDeviceInformation", async () => {

        Device.getDeviceInformation.mockResolvedValue({
            success: true,
            msg: 'getDeviceInformation - isConnected',
            data: {
                manufacturer: 'WaveShare',
                deviceName: 'WaveShare UPS',
                sensor: 'ina219',
                type: 'Voltage reading',
                isConnected: true,
                address: '0x42',
                busNumber: 1,
                configuration: {
                    mappedLabelsAndBits: {},
                    registerAsBinaryString: '00111110 11101111'
                },
                calibration: {
                    mappedLabelsAndBits: {},
                    registerAsBinaryString: '00010000 00000000'
                },
                calculationValues: {
                    currentLSB: 0.00009765625,
                    currentLSB_R: 0.0001,
                    powerLSB: 0.001953125,
                    calculationValue: 4194,
                    calculationValue_R: 4096
                }
            }
        });

        const getDeviceInformationSpy = jest.spyOn(NI_INA219, "getDeviceInformation");
        const result = await NI_INA219.getDeviceInformation();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: getDeviceInformation Not Initialized", async () => {

        Device.getDeviceInformation.mockResolvedValue({
            success: true,
            msg: 'getDeviceInformation - isConnected',
            data: {
                manufacturer: 'WaveShare',
                deviceName: 'WaveShare UPS',
                sensor: 'ina219',
                type: 'Voltage reading',
                isConnected: true
            }
        });

        const getDeviceInformationSpy = jest.spyOn(NI_INA219, "getDeviceInformation");
        const result = await NI_INA219.getDeviceInformation();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: getDeviceInformation ERROR. Bus", async () => {

        Device.getDeviceInformation.mockResolvedValue({
            success: false,
            msg: "[I2c Bus] - Write Error",
            data: {
                errorName: "",
                errorMessage: ""
            }
        });

        const getDeviceInformationSpy = jest.spyOn(NI_INA219, "getDeviceInformation");
        const result = await NI_INA219.getDeviceInformation();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: setConfigurationByTemplateId", async () => {

        const setConfigurationByTemplateIdSpy = jest.spyOn(Configuration, "setConfigurationByTemplateId");
        setConfigurationByTemplateIdSpy.mockResolvedValue({
            success: true,
            msg: 'Configuration register updated',
            data: {
                busVoltageMax: 32,
                shuntResistanceOhms: 0.1,
                gainVoltage: 0.32,
                currentMaxExpected: 3.2,
                registerAsDecimal: 16111,
                config: 16111
            }
        });

        const setCalibrationByTemplateIdSpy = jest.spyOn(Calibration, "setCalibrationByTemplateId");
        setCalibrationByTemplateIdSpy.mockResolvedValue({
            success: true,
            msg: 'Calibration register updated',
            data: {
                template: {
                    busVoltageMax: 32,
                    shuntResistanceOhms: 0.1,
                    gainVoltage: 0.32,
                    currentMaxExpected: 3.2,
                    registerAsDecimal: 16111,
                    config: 16111
                },
                calculationValues: {
                    currentLSB: 0.00009765625,
                    currentLSB_R: 0.0001,
                    powerLSB: 0.001953125,
                    calculationValue: 4194,
                    calculationValue_R: 4096
                }
            }
        });

        const INA219_setConfigurationByTemplateIdSpy = jest.spyOn(NI_INA219, "setConfigurationByTemplateId");

        const result = await NI_INA219.setConfigurationByTemplateId();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: getConfiguration", async () => {

        Configuration.getConfiguration.mockResolvedValue({
            success: true,
            msg: 'Configuration',
            data: {
                register: 'Configuration',
                valueRaw: undefined,
                valueString: undefined,
                valueType: {},
                extended: {
                    mappedLabelsAndBits: {},
                    registerAsBinaryString: '00111110 11101111'
                }
            }
        });

        const getConfigurationSpy = jest.spyOn(NI_INA219, "getConfiguration");
        const result = await NI_INA219.getConfiguration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: setCustomCalibration", async () => {

        Calibration.setCustomCalibration.mockResolvedValue({
            success: true,
            msg: "Calibration register updated",
            data: {
                template: undefined,
                calculationValues: {}
            }
        });

        const setCustomCalibrationSpy = jest.spyOn(NI_INA219, "setCustomCalibration");
        const result = await NI_INA219.setCustomCalibration(
            32, 0.1, 0.32, 3.2
        );

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

    test("- method: getCalibration", async () => {

        Calibration.getCalibration.mockResolvedValue({
            success: true,
            msg: 'Calibration',
            data: {
                register: 'Calibration',
                valueRaw: undefined,
                valueString: undefined,
                valueType: {},
                extended: {
                    mappedLabelsAndBits: {},
                    registerAsBinaryString: '00010000 00000000'
                }
            }
        });

        const getCalibrationSpy = jest.spyOn(NI_INA219, "getCalibration");
        const result = await NI_INA219.getCalibration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');
    });

})