import NI_INA219 from "../index";
import I2CBus from "../Src/Bus/I2C/index.js";

// Mocking the I2C bus wrapper for the 3rd party module
jest.mock('../Src/Bus/I2C/index.js');

// Mocking Actions layer
jest.mock("../Src/Actions/Configuration/index.js");
jest.mock("../Src/Actions/Calibration/index.js");

describe("[./Src/NI_INA.js] Suite - Method return shape testing", () => {

    /*
    beforeEach(() => {
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })
    */

    test("- method: initialize", async () => {
        const InitResultTrue = {
            success: true,
            msg: "[I2c] - Bus initialized at address",
            data: []
        };
        const WriteRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesWritten: 2
            }
        }
        I2CBus.initialize.mockResolvedValue(InitResultTrue);
        I2CBus.writeRegister.mockResolvedValue(WriteRegisterTrue);

        const initializeSpy = jest.spyOn(NI_INA219, "initialize");
        const result = await NI_INA219.initialize();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.initialize.mockClear();
        I2CBus.writeRegister.mockClear();
        initializeSpy.mockClear();
    });

    test("- method: setConfigurationByTemplateId", async () => {
        const WriteRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesWritten: 2
            }
        }
        I2CBus.writeRegister.mockResolvedValue(WriteRegisterTrue);

        const setConfigurationSpy = jest.spyOn(NI_INA219, "setConfigurationByTemplateId");
        const result = await NI_INA219.setConfigurationByTemplateId("32V2A");

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.writeRegister.mockClear();
        setConfigurationSpy.mockClear();
    });

    test("- method: setConfigurationByTemplateId - ERROR missing template ID", async () => {

        const setConfigurationSpy = jest.spyOn(NI_INA219, "setConfigurationByTemplateId");
        const result = await NI_INA219.setConfigurationByTemplateId("WRONG");

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        setConfigurationSpy.mockClear();
    });

    test("- method: setConfigurationByTemplateId - ERROR with write", async () => {
        const WriteRegisterFalse = {
            success: false,
            msg: "[I2c Bus] - Write Error",
            data: {
                errorName: "",
                errorMessage: ""
            }
        }
        I2CBus.readRegister.mockResolvedValue(WriteRegisterFalse);

        const setConfigurationSpy = jest.spyOn(NI_INA219, "setConfigurationByTemplateId");
        const result = await NI_INA219.setConfigurationByTemplateId("32V2A");

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.writeRegister.mockClear();
        setConfigurationSpy.mockClear();
    });

    test("- method: getConfiguration", async () => {
        const mockReadBuffer = Buffer.alloc(2, 0, "utf-8");
        const ReadRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesRead: 2,
                buffer: mockReadBuffer,
                payload: mockReadBuffer.readInt16BE(0, 2)
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterTrue);

        const getConfigurationSpy = jest.spyOn(NI_INA219, "getConfiguration");
        const result = await NI_INA219.getConfiguration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getConfigurationSpy.mockClear();
    });

    test("- method: getConfiguration - ERROR with read", async () => {
        const ReadRegisterFalse = {
            success: false,
            msg: "[I2c Bus] - Read Error",
            data: {
                errorName: "Error name",
                errorMessage: "Error in underlying lib"
            }
        }
        // I2CBus.readRegister.mockResolvedValue(ReadRegisterFalse);

        Configuration.getConfiguration.mockResolvedValue(ReadRegisterFalse);

        const getConfigurationSpy = jest.spyOn(NI_INA219, "getConfiguration");
        const result = await NI_INA219.getConfiguration();

        console.log("GET CONFIG", result);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getConfigurationSpy.mockClear();
    });

    test("- method: getCalibration", async () => {
        const mockReadBuffer = Buffer.alloc(2, 0, "utf-8");
        const ReadRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesRead: 2,
                buffer: mockReadBuffer,
                payload: mockReadBuffer.readInt16BE(0, 2)
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterTrue);

        const getCalibrationSpy = jest.spyOn(NI_INA219, "getCalibration");
        const result = await NI_INA219.getCalibration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getCalibrationSpy.mockClear();
    });

    test("- method: getCalibration - ERROR with read", async () => {
        const ReadRegisterFalse = {
            success: false,
            msg: "[I2c Bus] - Read Error",
            data: {
                errorName: "Error name",
                errorMessage: "Error in underlying lib"
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterFalse);

        const getCalibrationSpy = jest.spyOn(NI_INA219, "getCalibration");
        const result = await NI_INA219.getCalibration();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getCalibrationSpy.mockClear();
    });

    test("- method: getBusVoltage", async () => {
        const mockReadBuffer = Buffer.alloc(2, 0, "utf-8");
        const ReadRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesRead: 2,
                buffer: mockReadBuffer,
                payload: mockReadBuffer.readInt16BE(0, 2)
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterTrue);

        const getBusVoltageSpy = jest.spyOn(NI_INA219, "getBusVoltage");
        const result = await NI_INA219.getBusVoltage();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getBusVoltageSpy.mockClear();
    });

    test("- method: getBusVoltage - ERROR with read", async () => {
        const ReadRegisterFalse = {
            success: false,
            msg: "[I2c Bus] - Read Error",
            data: {
                errorName: "Error name",
                errorMessage: "Error in underlying lib"
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterFalse);

        const getBusVoltageSpy = jest.spyOn(NI_INA219, "getBusVoltage");
        const result = await NI_INA219.getBusVoltage();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getBusVoltageSpy.mockClear();
    });

    test("- method: getShuntVoltage", async () => {
        const mockReadBuffer = Buffer.alloc(2, 0, "utf-8");
        const ReadRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesRead: 2,
                buffer: mockReadBuffer,
                payload: mockReadBuffer.readInt16BE(0, 2)
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterTrue);

        const getShuntVoltageSpy = jest.spyOn(NI_INA219, "getShuntVoltage");
        const result = await NI_INA219.getShuntVoltage();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getShuntVoltageSpy.mockClear();
    });

    test("- method: getShuntVoltage - ERROR with read", async () => {
        const ReadRegisterFalse = {
            success: false,
            msg: "[I2c Bus] - Read Error",
            data: {
                errorName: "Error name",
                errorMessage: "Error in underlying lib"
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterFalse);

        const getShuntVoltageSpy = jest.spyOn(NI_INA219, "getShuntVoltage");
        const result = await NI_INA219.getShuntVoltage();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getShuntVoltageSpy.mockClear();
    });

    test("- method: getPower", async () => {
        const mockReadBuffer = Buffer.alloc(2, 0, "utf-8");
        const ReadRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesRead: 2,
                buffer: mockReadBuffer,
                payload: mockReadBuffer.readInt16BE(0, 2)
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterTrue);

        const getPowerSpy = jest.spyOn(NI_INA219, "getPower");
        const result = await NI_INA219.getPower();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getPowerSpy.mockClear();
    });

    test("- method: getPower - ERROR with read", async () => {
        const ReadRegisterFalse = {
            success: false,
            msg: "[I2c Bus] - Read Error",
            data: {
                errorName: "Error name",
                errorMessage: "Error in underlying lib"
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterFalse);

        const getPowerSpy = jest.spyOn(NI_INA219, "getPower");
        const result = await NI_INA219.getPower();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getPowerSpy.mockClear();
    });

    test("- method: getCurrent", async () => {
        const mockReadBuffer = Buffer.alloc(2, 0, "utf-8");
        const ReadRegisterTrue = {
            success: true,
            msg: "[I2c Bus] - Bytes written",
            data: {
                bytesRead: 2,
                buffer: mockReadBuffer,
                payload: mockReadBuffer.readInt16BE(0, 2)
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterTrue);

        const getCurrentSpy = jest.spyOn(NI_INA219, "getCurrent");
        const result = await NI_INA219.getCurrent();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getCurrentSpy.mockClear();
    });

    test("- method: getCurrent - ERROR with read", async () => {
        const ReadRegisterFalse = {
            success: false,
            msg: "[I2c Bus] - Read Error",
            data: {
                errorName: "Error name",
                errorMessage: "Error in underlying lib"
            }
        }
        I2CBus.readRegister.mockResolvedValue(ReadRegisterFalse);

        const getCurrentSpy = jest.spyOn(NI_INA219, "getCurrent");
        const result = await NI_INA219.getCurrent();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        I2CBus.readRegister.mockClear();
        getCurrentSpy.mockClear();
    });

    test("- method: getPowerSupplyVoltage", async () => {

        // Mock BV
        const BusVoltageReadRegisterTrue = {
            success: true,
            msg: 'BusVoltage',
            data: {
                register: 'BusVoltage',
                valueRaw: 8.396,
                valueString: '8.3960',
                valueType: { full: 'volt', plural: 'volts', short: 'V' },
                extended: {
                    mappedLabelsAndBits: [],
                    registerAsBinaryString: '01000001 10011000'
                }
            }
        }

        // Mock SV
        const ShuntVoltageReadRegisterTrue = {
            success: true,
            msg: 'ShuntVoltage',
            data: {
                register: 'ShuntVoltage',
                valueRaw: 0.00002,
                valueString: '0.0000',
                valueType: { full: 'milli-volt', plural: 'milli-volts', short: 'mV' },
                extended: {
                    mappedLabelsAndBits: [],
                    registerAsBinaryString: '00000000 00000010'
                }
            }
        }

        const getBusVoltageSpy = jest.spyOn(NI_INA219, "getBusVoltage");
        getBusVoltageSpy.mockReturnValue(BusVoltageReadRegisterTrue);

        const getShuntVoltageSpy = jest.spyOn(NI_INA219, "getShuntVoltage");
        getShuntVoltageSpy.mockReturnValue(ShuntVoltageReadRegisterTrue);

        const getPowerSupplyVoltage = jest.spyOn(NI_INA219, "getPowerSupplyVoltage");
        const result = await NI_INA219.getPowerSupplyVoltage();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        getPowerSupplyVoltage.mockClear();
        getBusVoltageSpy.mockClear();
        getShuntVoltageSpy.mockClear();
    });

    test("- method: getPowerSupplyVoltage - ERROR with read", async () => {
        // Mock BV
        const BusVoltageReadRegisterFalse = {
            success: false,
            msg: 'BusVoltage',
            data: {}
        }

        // Mock SV
        const ShuntVoltageReadRegisterTrue = {
            success: true,
            msg: 'ShuntVoltage',
            data: {
                register: 'ShuntVoltage',
                valueRaw: 0.00002,
                valueString: '0.0000',
                valueType: { full: 'milli-volt', plural: 'milli-volts', short: 'mV' },
                extended: {
                    mappedLabelsAndBits: [],
                    registerAsBinaryString: '00000000 00000010'
                }
            }
        }

        const getBusVoltageSpy = jest.spyOn(NI_INA219, "getBusVoltage");
        getBusVoltageSpy.mockReturnValue(BusVoltageReadRegisterFalse);

        const getShuntVoltageSpy = jest.spyOn(NI_INA219, "getShuntVoltage");
        getShuntVoltageSpy.mockReturnValue(ShuntVoltageReadRegisterTrue);

        const getPowerSupplyVoltage = jest.spyOn(NI_INA219, "getPowerSupplyVoltage");
        const result = await NI_INA219.getPowerSupplyVoltage();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        getPowerSupplyVoltage.mockClear();
        getBusVoltageSpy.mockClear();
        getShuntVoltageSpy.mockClear();
    });

    test("- method: getChargeRemaining", async () => {

        // Mock BV
        const BusVoltageReadRegisterTrue = {
            success: true,
            msg: 'BusVoltage',
            data: {
                register: 'BusVoltage',
                valueRaw: 8.396,
                valueString: '8.3960',
                valueType: { full: 'volt', plural: 'volts', short: 'V' },
                extended: {
                    mappedLabelsAndBits: [],
                    registerAsBinaryString: '01000001 10011000'
                }
            }
        }

        const getBusVoltageSpy = jest.spyOn(NI_INA219, "getBusVoltage");
        getBusVoltageSpy.mockReturnValue(BusVoltageReadRegisterTrue);

        const getChargeRemaining = jest.spyOn(NI_INA219, "getChargeRemaining");
        const result = await NI_INA219.getChargeRemaining();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        getChargeRemaining.mockClear();
        getBusVoltageSpy.mockClear();
    });

    test("- method: getChargeRemaining - ERROR with read", async () => {
        // Mock BV
        const BusVoltageReadRegisterFalse = {
            success: false,
            msg: 'BusVoltage',
            data: {}
        }

        const getBusVoltageSpy = jest.spyOn(NI_INA219, "getBusVoltage");
        getBusVoltageSpy.mockReturnValue(BusVoltageReadRegisterFalse);

        const getChargeRemaining = jest.spyOn(NI_INA219, "getChargeRemaining");
        const result = await NI_INA219.getChargeRemaining();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

        getChargeRemaining.mockClear();
        getBusVoltageSpy.mockClear();
    });

})