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

const getConfigurationHandler = async function () {
    let msg = "[Configuration] - getConfiguration:";
    let data = {};
    let getConfiguration = await NI_INA219.getConfiguration();
    if (getConfiguration.success === true) {
        data.table = getConfiguration.data.extended.mappedLabelsAndBits;
        data.dto = getConfiguration;
    } else {
        msg = "[Configuration: Error] - getConfiguration:";
    }
    return {
        success: getConfiguration.success,
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
    let initialized = await NI_INA219.initialize(0x42);

    if (initialized.success === true) {

        console.log("    ");
        
        // get the current active system configuration set after init
        let getConfiguration = await getConfigurationHandler();
        
        console.log(getConfiguration.msg);

        if( getConfiguration.success === true) {
            (displayAsTable === true) ? 
                console.table(getConfiguration.data.table) : 
                console.log(getConfiguration.data.dto);
        } else {
            console.log(getConfiguration.data.dto); 
        }

        console.log("    ");

        // change the MODE to trigger instead of continuous
        await NI_INA219.setModeTrigger();
        console.log("Setting mode to trigger");
        console.log("    ");

        // check to see if it has updated
        getConfiguration = await getConfigurationHandler();
        console.log(getConfiguration.msg);
        if( getConfiguration.success === true) {
            (displayAsTable === true) ? 
                console.table(getConfiguration.data.table) : 
                console.log(getConfiguration.data.dto);
        } else {
            console.log(getConfiguration.data.dto); 
        }
        console.log("    ");

    } else {
        console.log("STARTED SENSOR ERROR", started);
    }
}

const Main = async function _main() {

    console.log('----------------------------------------------------');
    console.log("[NICB:Main] - Started, trigger mode");

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
