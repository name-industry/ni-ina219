/**
 * @class Utilities
 * 
 * @summary 
 * Utility class for NI-INA219
 * 
 * @description 
 * Contains the methods to format or covert various values and types.
 * 
 **/

class Utilities {

    /**
     * @method Utilities#mappedLabelsAndBits
     * 
     * @param {Array} labelArray register model contains the array of bit labels
     * @param {Array} buffer array of bytes returned from read register
     * @returns {Array} hydrated array or bit labels with bit values
     */
    mappedLabelsAndBits = function (labelArray, buffer) {
        let byte0 = buffer[0].toString(2).padStart(8, "0");
        let byte1 = buffer[1].toString(2).padStart(8, "0");
        let bitArray = byte0.split("").concat(byte1.split(""));
        return bitArray.map((v, i) => {
            return labelArray[i] + ":" + v;
        })
    }

    /**
     * @method Utilities#registerAsBinaryString
     * 
     * @param {Array} buffer array of bytes returned from read register
     * @returns {String} binary value ( bit values for 2 bytes ) as string
     */
    registerAsBinaryString = function (buffer) {
        let formattedBinaryAsString = [];
        for (let i = 0; i < 2; i++) {
            formattedBinaryAsString.push(buffer[i].toString(2).padStart(8, "0"));
        }
        /* In case bit order is reversed
        for (let i = 0; i < 2; i++) {
            formattedBinaryAsString.unshift(buffer[i].toString(2).padStart(8, "0"));
        }
        */
        return formattedBinaryAsString.join(" ");
    }

}

export default new Utilities();