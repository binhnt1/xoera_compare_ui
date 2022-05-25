const fs = require('fs');
const fsw = require('fs');
const path = require('path');
const util = require('util');
var uglify = require("uglify-js");

// promisify core API's
let mainHash = '';
let mainBundleFile = '';
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appVersion = require('../package.json').version;
const versionFilePath = path.join(__dirname + '/../dist/xoeracompare/version.json');

// RegExp to find main.bundle.js, even if it doesn't include a hash in it's name (dev build)
let mainBundleRegexp = /^main.?([a-z0-9]*)?(\.bundle)?.js$/;
let vendorBundleRegexp = /^vendor.?([a-z0-9]*)?(\.bundle)?.js$/;
let scriptBundleRegexp = /^scripts.?([a-z0-9]*)?(\.bundle)?.js$/;
let polyfillsBundleRegexp = /^polyfills.?([a-z0-9]*)?(\.bundle)?.js$/;
readDir(path.join(__dirname, '../dist/xoeracompare/'))
    .then(files => {
        mainBundleFile = files.find(f => mainBundleRegexp.test(f));
        if (mainBundleFile) {
            let mainFile = path.join(__dirname, '../dist/xoeracompare/') + mainBundleFile;
            readFile(mainFile, "utf8").then(data => {
                let result = uglify.minify(data, { mangle: false });
                console.log('Done: ' + mainBundleFile);
                writeFile(mainFile, result.code);
            });
        }

        let vendorBundleFile = files.find(f => vendorBundleRegexp.test(f));
        if (vendorBundleFile) {
            let vendorFile = path.join(__dirname, '../dist/xoeracompare/') + vendorBundleFile;
            readFile(vendorFile, "utf8").then(data => {
                let result = uglify.minify(data);
                console.log('Done: ' + vendorBundleFile);
                writeFile(vendorFile, result.code);
            });
        }

        let scriptBundleFile = files.find(f => scriptBundleRegexp.test(f));
        if (scriptBundleFile) {
            let scriptFile = path.join(__dirname, '../dist/xoeracompare/') + scriptBundleFile;
            readFile(scriptFile, "utf8").then(data => {
                let result = uglify.minify(data);
                console.log('Done: ' + scriptBundleFile);
                writeFile(scriptFile, result.code);
            });
        }

        let polyfillBundleFile = files.find(f => polyfillsBundleRegexp.test(f));
        if (polyfillBundleFile) {
            let scriptFile = path.join(__dirname, '../dist/xoeracompare/') + polyfillBundleFile;
            readFile(scriptFile, "utf8").then(data => {
                let result = uglify.minify(data);
                console.log('Done: ' + polyfillBundleFile);
                writeFile(scriptFile, result.code);
            });
        }

        if (mainBundleFile) {
            let matchHash = mainBundleFile.match(mainBundleRegexp);

            // if it has a hash in it's name, mark it down
            if (matchHash.length > 1 && !!matchHash[1]) {
                mainHash = matchHash[1];
            }
        }
        if (mainHash) {
            console.log(`Hash ${mainHash}`);
            const src = `{"version": "${appVersion}", "hash": "${mainHash}"}`;
            return writeFile(versionFilePath, src);
        }
    }).catch(err => {
        console.log('Error with post build:', err);
    });