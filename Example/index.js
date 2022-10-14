// Programs
import nodeCleanup from "node-cleanup";
import NI_INA219 from "../index.js";

const initUPS = async function () {
    let started = await NI_INA219.initialize(0x42);
    if (started.success === true) {
        let CONFIGURATION = await NI_INA219.getConfiguration();
        console.log("CONFIGURATION", CONFIGURATION);
        let CALIBRATION = await NI_INA219.getCalibration();
        console.log("CALIBRATION", CALIBRATION);
        let BUS_VOLTAGE = await NI_INA219.getBusVoltage();
        console.log("BUS VOLTAGE", BUS_VOLTAGE);
        let SHUNT_VOLTAGE = await NI_INA219.getShuntVoltage();
        console.log("SHUNT VOLTAGE", SHUNT_VOLTAGE);
        let CURRENT_AMPS = await NI_INA219.getCurrent();
        console.log("CURRENT MILLIAMPS", CURRENT_AMPS);
        let POWER_WATTS = await NI_INA219.getPower();
        console.log("POWER WATTS", POWER_WATTS);
    } else {
        console.log("STARTED SENSOR ERROR", started);
    }
}

const Main = async function _main() {

    console.log("[NICB:Main] - Started");

    nodeCleanup(
        async function (exitCode, signal) {
            console.log("");
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
