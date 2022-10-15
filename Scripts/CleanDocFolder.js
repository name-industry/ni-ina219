import rimraf from 'rimraf';
rimraf("./Docs/NI-INA219/*", (err) => {
    console.log("res", err);
});