'use strict';
const fs = require('fs');
const path = require("path");
const jsonDiff = require('json-diff');

console.info(process.argv)
const environment = process.argv[2];

const langs = ["fi","en","sv"];
console.info(`Translation diff between local and ${environment}`)
langs.forEach(lang => {
    let localRaw = fs.readFileSync(path.resolve(__dirname,`translations_${lang}.json`));
    let localJson = JSON.parse(localRaw);
    let envRaw = fs.readFileSync(path.resolve(__dirname,`./environment/${environment}_${lang}.json`));
    let envJson = JSON.parse(envRaw);

    const diff = jsonDiff.diff(localJson,envJson)

    console.info(`Language: ${lang}`)
    if(!diff){
        console.info("No changes")
    }else{
        console.info(diff)
    }
});



