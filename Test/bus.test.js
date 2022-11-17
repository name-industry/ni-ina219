// 3rd party lib
import i2c from 'i2c-bus';

// Interface
import I2CBus from "../Src/Bus/I2C/index.js";

describe("[Bus - I2C] Suite - Wrapper for I2CBus", () => {

    beforeEach(() => {
    });

    afterEach(() => {
        // jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    test("- method: initialize", async () => {

        // Inputs
        let i2cAddress = 0x42;
        let busNumber = 1;
        let options = {};

        // Wire = Fake Bus returned from openPromisified
        let wire = {};
        wire.scan = () => {
            return [66]
        }

        i2c.openPromisified = jest.fn();
        i2c.openPromisified.mockResolvedValue(wire);

        const initializeSpy = jest.spyOn(I2CBus, "initialize");
        const result = await I2CBus.initialize(i2cAddress, busNumber, options);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: initialize ERROR. incorrect Bus value", async () => {

        // Inputs
        let i2cAddress = 0x24;
        let busNumber = "1";
        let options = {};

        // Wire = Fake Bus returned from openPromisified
        let mockError = {
            stack: `Error: Invalid I2C bus number busNumber
            at checkBusNumber (/home/pi/Documents/ni-ina219/node_modules/i2c-bus/i2c-bus.js:61:11)
            at open (/home/pi/Documents/ni-ina219/node_modules/i2c-bus/i2c-bus.js:35:3)
            at /home/pi/Documents/ni-ina219/node_modules/i2c-bus/i2c-bus.js:53:17
            at new Promise (<anonymous>)
            at Object.openPromisified (/home/pi/Documents/ni-ina219/node_modules/i2c-bus/i2c-bus.js:51:49)
            at I2CBus.initialize (file:///home/pi/Documents/ni-ina219/Src/Bus/I2C/index.js:73:30)
            at Device.initialize (file:///home/pi/Documents/ni-ina219/Src/Actions/Device/index.js:24:39)
            at NI_INA219.initialize (file:///home/pi/Documents/ni-ina219/Src/NI_INA219.js:84:39)
            at initUPS (file:///home/pi/Documents/ni-ina219/Example/index.js:30:32)
            at _main (file:///home/pi/Documents/ni-ina219/Example/index.js:102:11)`
        }

        i2c.openPromisified = jest.fn();
        i2c.openPromisified.mockRejectedValue(mockError);

        const initializeSpy = jest.spyOn(I2CBus, "initialize");
        const result = await I2CBus.initialize(i2cAddress, busNumber, options);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: initialize ERROR. not found at address", async () => {

        // Inputs
        let i2cAddress = 0x24;
        let busNumber = 1;
        let options = {};

        // Wire = Fake Bus returned from openPromisified
        let wire = {};
        wire.scan = () => {
            return [66]
        }

        i2c.openPromisified = jest.fn();
        i2c.openPromisified.mockResolvedValue(wire);

        const initializeSpy = jest.spyOn(I2CBus, "initialize");
        const result = await I2CBus.initialize(i2cAddress, busNumber, options);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: getConnectedDevices", async () => {

        I2CBus.wire = jest.fn();
        I2CBus.wire.scan = jest.fn();
        I2CBus.wire.scan.mockResolvedValue([22]);     

        const getConnectedDevicesSpy = jest.spyOn(I2CBus, "getConnectedDevices");
        const result = await I2CBus.getConnectedDevices();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: getConnectedDevices. ERROR. no devices found", async () => {

        I2CBus.wire = jest.fn();
        I2CBus.wire.scan = jest.fn();
        I2CBus.wire.scan.mockResolvedValue([]);     

        const getConnectedDevicesSpy = jest.spyOn(I2CBus, "getConnectedDevices");
        const result = await I2CBus.getConnectedDevices();

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: readRegister", async () => {

        let register = 0x01;

        I2CBus.wire = jest.fn();
        I2CBus.wire.readI2cBlock = jest.fn();
        I2CBus.wire.readI2cBlock.mockResolvedValue({ 
            bytesRead: 2, 
            buffer: Buffer.alloc(2, 0, "utf-8")
        });     

        const readRegisterSpy = jest.spyOn(I2CBus, "readRegister");
        const result = await I2CBus.readRegister(register);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: readRegister ERROR. invalid address", async () => {

        // note: the I2C-Bus underlying lib only
        // checks the format not if its actually reachable.

        let register = 0x01;
        let mockError = { name: 'Error', message: 'Invalid I2C address wrongAddress' };

        I2CBus.wire = jest.fn();
        I2CBus.wire.readI2cBlock = jest.fn();
        I2CBus.wire.readI2cBlock.mockRejectedValue(mockError);

        I2CBus.i2cAddress = "wrongAddress";

        const readRegisterSpy = jest.spyOn(I2CBus, "readRegister");
        const result = await I2CBus.readRegister(register);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: readRegister ERROR. invalid register", async () => {

        // note: the I2C-Bus underlying lib only
        // checks the format not if its actually reachable.

        let register = "wrongRegisterType";
        let mockError = { name: 'Error', message: 'Invalid I2C command register' };

        I2CBus.wire = jest.fn();
        I2CBus.wire.readI2cBlock = jest.fn();
        I2CBus.wire.readI2cBlock.mockRejectedValue(mockError);

        const readRegisterSpy = jest.spyOn(I2CBus, "readRegister");
        const result = await I2CBus.readRegister(register);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: writeRegister", async () => {

        let register = 0x01;
        let value = 1000;

        I2CBus.wire = jest.fn();
        I2CBus.wire.writeI2cBlock = jest.fn();
        I2CBus.wire.writeI2cBlock.mockResolvedValue({ 
            bytesWritten: 2,
            buffer: Buffer.alloc(2, 0, "utf-8")
        });     

        const writeRegisterSpy = jest.spyOn(I2CBus, "writeRegister");
        const result = await I2CBus.writeRegister(register, value);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: writeRegister ERROR. invalid address", async () => {

        // note: the I2C-Bus underlying lib only
        // checks the format not if its actually reachable.

        let register = 0x01;
        let value = 1000;
        let mockError = { name: 'Error', message: 'Invalid I2C address wrongAddress' };

        I2CBus.wire = jest.fn();
        I2CBus.wire.writeI2cBlock = jest.fn();
        I2CBus.wire.writeI2cBlock.mockRejectedValue(mockError);

        I2CBus.i2cAddress = "wrongAddress";

        const writeRegisterSpy = jest.spyOn(I2CBus, "writeRegister");
        const result = await I2CBus.writeRegister(register, value);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

    test("- method: writeRegister ERROR. invalid register", async () => {

        // note: the I2C-Bus underlying lib only
        // checks the format not if its actually reachable.

        let register = "wrongRegisterType";
        let value = 1000;
        let mockError = { name: 'Error', message: 'Invalid I2C command register' };

        I2CBus.wire = jest.fn();
        I2CBus.wire.writeI2cBlock = jest.fn();
        I2CBus.wire.writeI2cBlock.mockRejectedValue(mockError);

        const writeRegisterSpy = jest.spyOn(I2CBus, "writeRegister");
        const result = await I2CBus.writeRegister(register, value);

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })

})