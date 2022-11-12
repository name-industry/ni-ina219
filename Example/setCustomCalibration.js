// Programs
import nodeCleanup from "node-cleanup";
import NI_INA219 from "../index.js";

/**
 * When showing a full return 
 * display the mapped register label+bit as
 * a table instead of JSON obj
 * 
 * Note: needs a terminal shell that supports
 * console.table(). This is not an ansi table
 * 
 */
const displayAsTable = false;

/**
 * Pass in the data transfer object and 
 * extract the value data or display an error msg
 * 
 * @param {object} dto 
 * @returns 
 */
const formattedValueOutput = function (dto) {
    if (dto.success === true)
        return dto.data.valueString + " " + dto.data.valueType.short;
    else {
        return "Error getting result";
    }
}

const getCalibrationHandler = async function () {
    let msg = "[Calibration] - getCalibration:";
    let data = {};
    let getCalibration = await NI_INA219.getCalibration();
    if (getCalibration.success === true) {
        data.table = getCalibration.data.extended.mappedLabelsAndBits;
        data.dto = getCalibration;
    } else {
        msg = "[Calibration: Error] - getCalibration:";
    }
    return {
        success: getCalibration.success,
        msg, // Update msg
        data // Update/Translate/Filter values
    };
}

/**
 * WaveShare board - 
 * 
 * Bus Voltage - measured on the load side : called Load by WaveShare
 * Shunt Voltage - measured between V+ and V- across the shunt : See wiring diagram
 * Power Supply Voltage - adds together the Bus + Shunt voltages
 * The charge remaining in the batteries is the Bus Voltage + some magic numbers
 * 
 * Notes: 
 * Current - if negative value then the hat is powering the PI board
 * 
 */

const initUPS = async function () {

    // initialize the system
    let initialized = await NI_INA219.initialize(0x42, 1, "32V2A");

    if (initialized.success === true) {

        console.log("    ");

        // get the current active system configuration set after init
        let getCalibration = await getCalibrationHandler();

        console.log(getCalibration.msg);

        if (getCalibration.success === true) {
            (displayAsTable === true) ?
                console.table(getCalibration.data.table) :
                console.log(getCalibration.data.dto);
        } else {
            console.log(getCalibration.data.dto);
        }

        console.log("    ");

        /*
        let getCurrentBusVoltage = await NI_INA219.getBusVoltage();
        console.log("BUS-V", getCurrentBusVoltage);
        console.log("    ");
        */

        /*
            EXPERIMENTAL
            NI_INA219.setCustomCalibration

            should set a custom config as well as the custom calibration
            values as they are interdependent.

            BUS VOLTAGE
            32, // can be 16 or 32 
            
            SHUNT RESISTANCE
            0.1, // usually 0.1 unless the shunt was modded

            PGA GAIN + ROUGH MAX EXPECTED VOLTAGE across the shunt
            Constants.CONFIGURATION.GAIN ie: DIV_8_320MV = 0.32 in hex 0x03
            Gain voltage to faux max current expected
            320mv 0.32 3.2
            160mv 0.16 1.6
             80mv 0.08 0.8
             40mv 0.04 0.4

        */

        console.log("Update calc values");
        let wasSet = await NI_INA219.setCustomCalibration(
            32,     // busVoltageMax
            0.1,    // shuntResistanceOhms
            0.32,   // gainVoltage
            1.6    // currentMaxExpected
        );

        console.log("    ");

        // check to see if it has updated
        getCalibration = await getCalibrationHandler();

        console.log(getCalibration.msg);

        if (getCalibration.success === true) {
            (displayAsTable === true) ?
                console.table(getCalibration.data.table) :
                console.log(getCalibration.data.dto);
        } else {
            console.log(getCalibration.data.dto);
        }

        console.log("    ");;

    } else {
        console.log("STARTED SENSOR ERROR", started);
    }
}

const Main = async function _main() {

    console.log('----------------------------------------------------');
    console.log("[NICB:Main] - Started, setting custom calibration values");

    nodeCleanup(
        async function (exitCode, signal) {
            console.log("[NICB:Main] - Node cleanup starting");
        },
        {
            ctrl_C: "[NICB:Main] - Node cleanup end - User Exit",
            uncaughtException: "[NICB:Main] - Exit by Exception",
        }
    );

    // run sequence
    await initUPS();

    // end and exit
    return {
        result: "End run"
    };

};

// Run
Main()
    .then(async (d) => {
        console.log("[NICB:Main] - Program", d);
    })
    .catch((e) => {
        console.log("[NICB:Main] - Error on start", e);
    });
