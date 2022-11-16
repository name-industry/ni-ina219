// 3rd party lib
import i2c from 'i2c-bus';

// Interface
import I2CBus from "../Src/Bus/I2C/index.js";

// Mocking the I2C bus wrapper for the 3rd party module

jest.mock('i2c-bus')
    .mock('../Src/Bus/I2C/index.js');

describe("[Bus - I2C] Suite - Wrapper for I2CBus", () => {

    beforeEach(() => {
    });

    afterEach(() => {
        // jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    test("- method: initialize", async () => {

        let result = {
            success: true,
            msg: "",
            data: {}
        }

        // check if its an object
        expect(result).toBeInstanceOf(Object);

        // check if each property is found on the return
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('data');

    })
})