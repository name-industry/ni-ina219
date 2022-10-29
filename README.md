<br />
<div align="left">
  <img src="./Docs/img/830x80_NI_INA219_Light.png"
       alt="header img"
       width="830px"
  />
</div>

<br />

<div align="left">
  <img src="https://img.shields.io/badge/version-v0.0.1-green" />
  <img src="https://img.shields.io/badge/nodeJs-v15.14.0-yellowgreen" />
  <img src="https://img.shields.io/badge/Raspberry--PI-v4b-FF69B4" />
  <img src="https://img.shields.io/badge/jsDocs-v3.5-yellow" />
</div>

<br />

#### Module for using the [WaveShare UPS Raspberry Pi Hat](https://www.waveshare.com/product/raspberry-pi/hats/ups-hat.htm) that has an embedded [Texas Instruments INA219 sensor](https://www.ti.com/lit/ds/symlink/ina219.pdf).
<br />

<div align="center">
  <img src="./Docs/img/UPS-HAT-details-3.jpg" width="30%">
  <img src="./Docs/img/UPS-HAT-details-9.jpg" width="31.8%">
  <img src="./Docs/img/UPS-HAT-details-size.jpg" width="34.8%">
</div>

<br />

#### Contents:
<br />

1. [Quick start](#1-quick-start)
2. [Description](#2-description)
3. [Dependencies](#3-dependencies)
4. [Documentation](#4-documentation)
5. [Coverage & Tests](#5-coverage--tests)
6. [Examples](#6-examples)
7. [Measurements](#7-measurements)
8. [Prior art](#8-prior-art)
9. [Links to other NI modules](#9-links-to-other-ni-modules)
10. [Other links](#10-other-links)

<br />

## 1. Quick start

<br />

Create folder or ad to existing code.
Make sure to have package.json set to module if using imports instead of require. This lib is only tested with imports ie:

```json
{
  "main": "./index.js",
  "type":"module",
  "scripts": {
    "start": "node ./index.js"
  }
}
```
add module:

```Javascript
yarn add @name-industry/ni-ina219
```

in index.js copy this:


```Javascript
import NI_INA219 from "@name-industry/ni-ina219";

const formattedOutput = function (valueObject) {
    if (valueObject.success === true)
        return valueObject.data.valueString + " " + valueObject.data.valueType.short;
    else {
        return "Error getting result";
    }
}

const initUPS = async function () {
    
    // initialize the system
    let started = await NI_INA219.initialize(0x42);
    
    if (started.success === true) {

        // DEBUG shows full return JSON object 

        // get the current active system configuration
        let CONFIGURATION = await NI_INA219.getConfiguration();
        console.log("CONFIGURATION", CONFIGURATION);
        
        // get the current active calibration values
        let CALIBRATION = await NI_INA219.getCalibration();
        console.log("CALIBRATION", CALIBRATION);

        // Shows quasi formatted result of measurement

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
        let POWER_SUPPLY_VOLTAGE = await NI_INA219.getPowerSupplyVoltage();
        console.log("    POWER SUPPLY VOLTAGE ", formattedOutput(POWER_SUPPLY_VOLTAGE));
        
        // Battery charge remaining - Custom calc for WaveShare Hat only
        let CHARGE_REMAINING = await NI_INA219.getChargeRemaining();
        console.log("    CHARGE REMAINING     ", formattedOutput(CHARGE_REMAINING));

    } else {
        console.log("STARTED SENSOR ERROR", started);
    }
}

initUPS();
```

run from project terminal:

```Javascript
yarn start
```

example output for full json object. Note: [Array]  is the default terminal output for nested objects. To see the full terminal results you would need to update terminal settings. In code you will get back the full object/array of course:

```json
CONFIGURATION {
  success: true,
  msg: "Configuration",
  data: {
    register: "Configuration",
    valueRaw: undefined,
    valueString: undefined,
    valueType: {},
    extended: {
      mappedLabelsAndBits: [Array],
      registerAsBinaryString: "00111110 11101111"
    }
  }
}
```

example output for quasi formatted results. Note: your results of course will vary ( values ) depending your device setup and battery charge:

```terminal
    BUS VOLTAGE           8.2360 V
    SHUNT VOLTAGE         -0.0195 mV
    CURRENT MILLIAMPS     -194.8000 mA
    POWER WATTS           1.6020 W
    POWER SUPPLY VOLTAGE  8.2045 V
    CHARGE REMAINING      93 %
```


<br />

## 2. Description
<br />
<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,raspberrypi" />
  </a>
</p>

Uninterruptible Power Supply (UPS) for Raspberry PI. Allows for easily developing projects that could require emergency shutdown or logging during a power outage, giving extra run time when it is needed. 

It uses an 8.4v adapter for charging and has space for 2x 18650 batteries. I was using 2 of these Panasonic [NCR18650B](https://www.orbtronic.com/content/NCR18650B-Datasheet-Panasonic-Specifications.pdf) for testing.

This hat is built and sold by WaveShare. The version this module is written for can be viewed/purchased [here](https://www.waveshare.com/product/raspberry-pi/hats/ups-hat.htm?sku=18306).

The hat uses an embedded INA-219 sensor for reading voltage, current and power along with the ability to set its system configuration to match the system its being installed for. 

This module interacts specifically with the INA-219 on this hat.

<br />

## 3. Dependencies
<br /><br />
Currently for using the example in the ./Example folder and to run tests via Jest, There is included the i2c-bus library found [here](https://github.com/fivdi/i2c-bus). This module ( NI_INA219 ) is not meant to run on its own, but rather controlled via a parent application. Its more like an API exposing services and calls to other applications. When it is feature complete i2c-bus will be removed. Under normal situations the end user will provide the handle to the wire. BigJS deals with issues arising from toFixed in floating point conversions. Not really that much of a problem in this module but nice to have when we are rounding properly for UI displays.
<br /><br />
### 3.1 - 3rd Party Dependencies

| name | description | version |
| - | - | - |
| ic2-bus | NodeJs interface to the I2C bus | ^5.2.2 |
| big.js | Javascript lib to try and keep some fp precision | ^6.2.1 |

### 3.2 - Development Dependencies

| name | description | version |
| - | - | - |
| node | using ES module/class constructs | >= 18 |
| jsDocs | for documentation of the module | ^3.6.11 |
| jest | for unit/integration testing | ^29.2.1 |

various other helper packages:

    - "@babel/core": "^7.19.3",
    - "@babel/preset-env": "^7.19.4",
    - "babel-jest": "^29.2.1",
    - "http-server": "^14.1.1",
    - "jsdoc-template": "braintree/jsdoc-template",
    - "jsdoc-to-markdown": "^7.1.1",
    - "node-cleanup": "^2.1.2",
    - "rimraf": "^3.0.2"

*note: these are only required for developing this module and not for ingest of the module. More details around developing this module in section - ?*

<br />

## 4. Documentation 
<br />
<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=jest,nodejs,html,js" />
  </a>
</p>

The module is fully documented with jsDoc within the source as well as the generated docs being included in the Repo. You can pull up the docs at anytime using the small server via Node / Yarn. Creating the docs again is also available.

### 4.1 - View the docs in a browser
<br />

Run this from console.

```Javascript
yarn docs-view
```
*note: when running the server if you are on a different platform ie: remote in via vsCode ssh, that the port forwarding needs to be working since the server boots local*

<br />

### 4.2 Re-create the docs from source
<br />
Output is in ".Docs/NI-INA219". The html in Docs is kept for versioning and adding resources/documents that are persistent.

```Javascript
yarn docs-create
```

<br />

## 5. Coverage & Tests  
<br />
<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=jest,nodejs,html,js" />
  </a>
</p>
<br />

Run this from console.

Currently the main NI_INA219 js file is running with tests and outputs coverage. The wrapper for the 3rd party Ic2-Bus module is mocked. The tests are only for returning the correct valid method result shape for data and errors. All methods pass around a value object for modularity.

```Javascript
yarn test
```

Running this will output coverage in the ./coverage folder by default. This will be hoisted into the ./Docs folder to be displayed alongside the main jsDocs.

<br />

## 6. Examples  
<br />
<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs" />
  </a>
</p>

Currently only the base example ( quick start is available ). Located in ./Example/index.js

<br />

## 7. Measurements  
<br />

## 8. Prior art
<br />
This library builds on these two versions:<br />
 <br />
 [WaveShare's Python demo code](https://www.waveshare.com/wiki/UPS_HAT)<br />
  [nodejs version by brettmarl on GitHub](https://github.com/brettmarl/node-ina219)
  <br />
  <br />
  Uses [I2c-bus](https://github.com/fivdi/i2c-bus) temporarily for developing - but will be removed once complete as the module should be provided a promise-based bus 
  on instantiation.<br /><br />

<br />

## 9. Links to other NI modules
<br />

## 10. Other links 
<br />
