

<div align="left">
  <img src="./Docs/img/830x80_NI_INA219_Light.png"
       alt="header img"
       width="830px"
  />
</div>

<br /><br />

<div align="left">
  <img src="https://img.shields.io/badge/version-v0.0.1-green" />
  <img src="https://img.shields.io/badge/nodeJs-v15.14.0-yellowgreen" />
  <img src="https://img.shields.io/badge/Raspberry--PI-v4b-FF69B4" />
  <img src="https://img.shields.io/badge/jsDocs-v3.5-yellow" />
</div>

#### Module for using the [WaveShare UPS Raspberry Pi Hat](https://www.waveshare.com/product/raspberry-pi/hats/ups-hat.htm) that has an embedded [TI INA219](https://www.waveshare.com/w/upload/1/10/Ina219.pdf)_sensor.

<br />

1. Quick start
2. Description
3. Dependencies
4. Documentation
5. Examples
6. Measurements
7. Prior art
8. Links to other NI modules
9. Other links

### 1. Quick start

clone repo

```Javascript
yarn install
```

```Javascript

import NI_INA219 from "ni-ina219";

let defaultIC2SensorAddress = 0x42;
let initializeUPS = await NI_INA219.initialize(defaultIC2SensorAddress);

if(initializeUPS.success === true) {
  // Ready
  console.log("Initialized sensor", initializeUPS);
} else {
  // there was an error with the bus and or writing/reading to the device
  console.log("Initialized sensor error", initializeUPS);
}

<br /><br />

<br /><br />

<br /><br />

<br /><br />
(6) Prior Art
This library builds on these two versions:<br />
 <br />
 [WaveShare's Python demo code]{@link https://www.waveshare.com/wiki/UPS_HAT}<br />
  [nodejs version by brettmarl on GitHub]{@link https://github.com/brettmarl/node-ina219}
  <br />
  <br />
  Uses [I2c-bus]{@link https://github.com/fivdi/i2c-bus} temporarily for developing - 
 but will be removed once complete as the module should be provided a promise-based bus 
  on instantiation.<br /><br />
  
  Testing hardware:<br /> 
  1 x Raspberry Pi 4b with the WaveShare UPS hat installed.<br />
  2 x NCR18650B 18650 Battery<br /><br />
  #note: Battery type Panasonic-Japan 3400mAh Li-ion 3.7V Flat Top Rechargeable [3.6 <> 4.2 cutoff 2.5]<br />
  [specs]{@link https://www.orbtronic.com/content/NCR18650B-Datasheet-Panasonic-Specifications.pdf}<br />
