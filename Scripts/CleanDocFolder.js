import rimraf from 'rimraf';
rimraf("./Docs/docs/*", (err) => {
    console.log("res", err);
});