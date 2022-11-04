import rimraf from 'rimraf';
rimraf("./Docs/@name-industry/*", (err) => {
    console.log("res", err);
});