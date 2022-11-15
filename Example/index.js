// Programs
import nodeCleanup from "node-cleanup";
import NI_INA219 from "../index.js";


const formattedOutput = function (valueObject) {
    if (valueObject.success === true)
        return valueObject.data.valueString + " " + valueObject.data.valueType.short;
    else {
        return "Error getting result";
    }
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
    let INIT = await NI_INA219.initialize(0x42);

    console.log("INIT", INIT);
    console.log("    ");

    if (INIT.success === true) {

        // Device info available
        let DEVICE = await NI_INA219.getDeviceInformation();
        console.log("DEVICE", DEVICE);
        console.log("    ");

        // DEBUG shows full return JSON object 

        // get the current active system configuration
        let CONFIGURATION = await NI_INA219.getConfiguration();
        console.log("CONFIGURATION", CONFIGURATION);
        console.log("    ");
        
        // get the current active calibration values
        let CALIBRATION = await NI_INA219.getCalibration();
        console.log("CALIBRATION", CALIBRATION);

        // get the Bus voltage
        let BUS_VOLTAGE = await NI_INA219.getBusVoltage();
        console.log("    BUS VOLTAGE          ", formattedOutput(BUS_VOLTAGE)); // load

        // get the Shunt voltage
        let SHUNT_VOLTAGE = await NI_INA219.getShuntVoltage();
        console.log("    SHUNT VOLTAGE        ", formattedOutput(SHUNT_VOLTAGE));

        // get the Current in Milliamps
        let CURRENT_AMPS = await NI_INA219.getCurrent();
        console.log("    CURRENT MILLIAMPS    ", formattedOutput(CURRENT_AMPS));

        // get the Power in Watts
        let POWER_WATTS = await NI_INA219.getPower();
        console.log("    POWER WATTS          ", formattedOutput(POWER_WATTS));

        // PSU voltage - Custom calc for WaveShare Hat only
        let POWER_SUPPLY_VOLTAGE = await NI_INA219.getPowerSupplyVoltageWS();
        console.log("    POWER SUPPLY VOLTAGE ", formattedOutput(POWER_SUPPLY_VOLTAGE));

        // Battery charge remaining - Custom calc for WaveShare Hat only
        let CHARGE_REMAINING = await NI_INA219.getChargeRemainingWS();
        console.log("    CHARGE REMAINING     ", formattedOutput(CHARGE_REMAINING));

        console.log("    ");
        console.log("    ");


    } else {
        console.log("STARTED SENSOR ERROR", started);
    }
}

const Main = async function _main() {

    console.log('----------------------------------------------------');
    console.log("[NICB:Main] - Started");

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
