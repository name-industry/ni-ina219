/**
 * @class PowerSupplyModel
 * 
 * @summary
 * POWER Supply Model
 * 
 * @description
 * The WaveShare UPS Hat, calculates the PSU Voltage
 * by adding the bus voltage and the shunt voltage.
 */
import BaseRegisterModel from "../../BaseModels/BaseRegisterModel.js";
import Big from "big.js";

class PowerSupplyModel extends BaseRegisterModel {

    constructor() {
        super("PowerSupplyVoltage");
    }

    /**
     * @method PowerSupplyModel#formatData
     * 
     * @summary
     * Overrides - This model is a calculation only model no registers
     * 
     * @description
     * Extended return format for calculation only. Returns empty objects 
     * where data is not applicable while retaining the method return
     * fingerprint.
     */
    formatData = function () {
        let calculatedValue = this.calculateValue();
        this.currentFormattedData = {
            register: this.registerName,
            valueRaw: calculatedValue.rawNumber,
            valueString: calculatedValue.withPrecision,
            valueType: this.measurement[this.language]
        }
        if (this.useFullReturn === true) {
            this.currentFormattedData["extended"] = {
                mappedLabelsAndBits: [],
                registerAsBinaryString: ""
            }
        }
    }

    /**
     * @type {object}
     * 
     * @summary
     * the type of value in the register
     * 
     * @description
     * Currently only english language value types
     */
    measurement = {
        en: {
            full: "volt",
            plural: "volts",
            short: "V"
        }
    }

    /**
    * @method PowerSupplyModel#calculateValue
    * 
    * @summary
    * Requires results from BusVoltage and ShuntVoltage
    * 
    * @description
    * Calculate the PowerSupply voltage
    */
    calculateValue = function () {
        let busVoltage = this.currentRawData.busVoltage.data.valueRaw;
        let shuntVoltage = this.currentRawData.shuntVoltage.data.valueRaw;
        let calculation = busVoltage + shuntVoltage;
        let formatted = new Big(calculation).toFixed(this.defaultPrecision);
        return {
            rawNumber: calculation,
            withPrecision: formatted
        }
    }
}

export default new PowerSupplyModel();