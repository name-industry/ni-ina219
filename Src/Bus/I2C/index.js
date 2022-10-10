/**
 * I2c Utility methods
 * 
 * Registers are 16 bits. 
 * Read a Block at once via SMBus. Upto 32Bytes
 * Requires the I2c Address in Hex for the device
 * Requires the Register Pointer in Hex ( where to read )
 * Requires the length as an INT for total bytes to read back up to 32 Bytes
 * Requires a buffer with minimum = to length where results are places.
 * 
 * Example:
 *  I2C_ADDRESS = 0x40;
 *  REG_BUS_VOLTAGE_R = 0x02;
 *  length = 2; // because INA219's 16 bit 2 byte size block
 *  
 * Notes: 
 * 
 *  In node we can allocate a buffer with a size and type and default values.
 *  I am not sure what the underlying wrappers to the main SMBus returns.
 * 
 * Raspberry Pi -> lscpu | grep -i endian
 *  returns Little Endian also double check
 * echo -en \\001\\002 | od -An -tx2
 *  0201  # little-endian <- returns
 *  0102  # big-endian
 * 
 */

 import i2c from 'i2c-bus';

 class I2cBus {
 
     constructor() { }
 
     /**
      * initialize
      * 
      *  Please note i2c-bus lib allows you to connect to any
      *  bus number as long as its an INT. So the returned
      *  bus object does not fail/error on "open" of an arbitrary
      *  Hardware Bus line.
      * 
      * @param {*} i2cAddress 
      * @param {*} busNumber 
      * @returns 
      */
     initialize = async function (
         i2cAddress,
         busNumber
     ) {
         let wire;
 
         try {
             wire = i2c.openSync(busNumber);
         } catch (error) {
             return {
                 success: false,
                 msg: "[I2c] - Error on Open",
                 data: error
             }
         }
 
         let allAddressesFound = wire.scanSync();
         if (allAddressesFound.length === 0) {
             return {
                 success: false,
                 msg: "[I2c] - No device found",
                 data: {
                     wire: wire,
                     i2cAddressRequested: "0x" + i2cAddress.toString(16)
                 }
             }
         } else {
 
             this.updateBus(i2cAddress, wire);
 
             return {
                 success: true,
                 msg: "[I2c] - Ready",
                 data: {
                     wire: wire,
                     i2cAddressRequested: "0x" + i2cAddress.toString(16),
                     allAddresses: allAddressesFound.map((v, i) => { return "0x" + v.toString(16) })
                 }
             }
         }
     }
 
     /**
      * Class setter
      * 
      * @param {*} i2cAddress 
      * @param {*} busNumber 
      */
     updateBus = function (i2cAddress, wire) {
         this.i2cAddress = i2cAddress;
         this.wire = wire;
     }
 
     cleanupBus = function () { };
 
     readRegister = async function (register) {
         let resultBuffer = Buffer.alloc(2, 0, "utf-8");
         let bytesRead = this.wire.readI2cBlockSync(this.i2cAddress, register, 2, resultBuffer);
         return {
             bytesRead: bytesRead,
             buffer: resultBuffer,
             payload: resultBuffer.readInt16BE(0, 2)
         }
     }
 
     writeRegister = async function (register, value) {
         let bytes = Buffer.alloc(2, 0, "utf-8");
         bytes[0] = (value >> 8) & 0xFF;
         bytes[1] = value & 0xFF
         let bytesWritten = this.wire.writeI2cBlockSync(this.i2cAddress, register, 2, bytes);
         return {};
     }
 
 }
 
 export default new I2cBus();