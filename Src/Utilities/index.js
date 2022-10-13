/**
 * Utility methods
 * 
 */

 export const mappedLabelsAndBits = function (labelArray, buffer) {
    let byte0 = buffer[0].toString(2).padStart(8, "0");
    let byte1 = buffer[1].toString(2).padStart(8, "0");
    let bitArray = byte0.split("").concat(byte1.split(""));
    return bitArray.map((v, i) => {
        return labelArray[i] + ":" + v;
    })
}

export const registerAsBinaryString = function (buffer) {
    let formattedBinaryAsString = [];
    for (let i = 0; i < 2; i++) {
        formattedBinaryAsString.push(buffer[i].toString(2).padStart(8, "0"));
    }
    /* In case bit order is reversed
    for (let i = 0; i < 2; i++) {
        formattedBinaryAsString.unshift(buffer[i].toString(2).padStart(8, "0"));
    }
    */
    return {
        formattedBinaryAsString: formattedBinaryAsString.join(" ")
    }
}