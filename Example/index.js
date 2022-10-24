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
 * Shunt Voltage - measured between V+ and V- across the shunt : 
 * Power Supply Voltage - adds together the Bus + Shunt voltages
 * The charge remaining in the batteries is the Bus Voltage + some magic numbers
 * Current - if negative value then the hat is powering the PI board
 * 
 */

const initUPS = async function () {
    let started = await NI_INA219.initialize(0x42);
    if (started.success === true) {
        // let CONFIGURATION = await NI_INA219.getConfiguration();
        // console.log("CONFIGURATION", CONFIGURATION);
        // let CALIBRATION = await NI_INA219.getCalibration();
        // console.log("CALIBRATION", CALIBRATION);
        let BUS_VOLTAGE = await NI_INA219.getBusVoltage();
        console.log("    BUS VOLTAGE          ", formattedOutput(BUS_VOLTAGE)); // load
        let SHUNT_VOLTAGE = await NI_INA219.getShuntVoltage();
        console.log("    SHUNT VOLTAGE        ", formattedOutput(SHUNT_VOLTAGE));
        let CURRENT_AMPS = await NI_INA219.getCurrent();
        console.log("    CURRENT MILLIAMPS    ", formattedOutput(CURRENT_AMPS));
        let POWER_WATTS = await NI_INA219.getPower();
        console.log("    POWER WATTS          ", formattedOutput(POWER_WATTS));
        let POWER_SUPPLY_VOLTAGE = await NI_INA219.getPowerSupplyVoltage();
        console.log("    POWER SUPPLY VOLTAGE ", formattedOutput(POWER_SUPPLY_VOLTAGE));

        // edits
        let chargeRemaining = (BUS_VOLTAGE.data.valueRaw - 6)/2.4*100; //2.4*100;
        if(chargeRemaining > 100) chargeRemaining = 100;
        if(chargeRemaining < 0) chargeRemaining = 0;
        console.log("    CHARGE REMAINING     ", chargeRemaining + " %");

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
