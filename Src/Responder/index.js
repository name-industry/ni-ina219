export const outputAsJson = function (data, options) {
    if (options.passThrough) {
        return data;
    } else {
        return {
            success: true,
            msg: data.register,
            data: data
        }
    }
}