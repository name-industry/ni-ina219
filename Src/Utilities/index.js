/**
 * Utility methods
 * 
 */

 export const formatRegisterOutput = function (cmd, labelMap, buf, len) {
    let result = [];
    let byte0 = buf[0].toString(2).padStart(8, "0");
    let byte1 = buf[1].toString(2).padStart(8, "0");
    let bitArray = byte0.split("").concat(byte1.split(""));
    let mappedBitValues = bitArray.map((v, i) => {
        return labelMap[i] + ":" + v;
    })

    for (let i = 0; i < len; i++) {
        // unshift to pop it the other way
        result.push(buf[i].toString(2).padStart(8, "0"));
    }
    return {
        string: result.join(" "),
        cmd: cmd,
        mappedBitValues: mappedBitValues,
        manualBytesToString: byte0 + byte1,
        integer: parseInt(byte0 + byte1, 2)
    }
}