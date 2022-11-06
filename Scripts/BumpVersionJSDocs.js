import { readFile, writeFile } from 'fs'
const lastVersion = process.env.npm_package_version;

// TODO: use client bump similar to np to edit existing file versions
const newVersion = "";

// Change Version in Comments in the main JS file.
readFile('./Src/NI_INA219.js', 'utf-8', (err, contents) => {
    if (err) {
        return console.error(err)
    }

    const replacer = new RegExp(lastVersion, 'gi');
    const updated = contents.replace(replacer, newVersion)
    writeFile('./Src/NI_INA219.js', updated, 'utf-8', err2 => {
        if (err2) {
            console.log(err2)
        }
    })
})

// Change Version JSDocs shell link for the iframe.
readFile('./Docs/index.html', 'utf-8', (err, contents) => {
    if (err) {
        return console.error(err)
    }

    const replacer = new RegExp(lastVersion, 'gi');
    const updated = contents.replace(replacer, newVersion)
    writeFile('./Docs/index.html', updated, 'utf-8', err2 => {
        if (err2) {
            console.log(err2)
        }
    })
})