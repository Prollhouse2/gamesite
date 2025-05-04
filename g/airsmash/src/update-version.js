const fs = require('fs');
const path = require('path');

console.log(`---- ${path.basename(__filename)}\n`);

const versionJsPath = path.join(__dirname, 'js', 'Version.js');
const packageJsonPath = path.join(__dirname, '..', 'package.json');

console.log(`Reading ${packageJsonPath}`);
const version = JSON.parse(fs.readFileSync(packageJsonPath)).version

console.log(`Version is ${version}`);
const js = `module.exports = '${version}'`;

console.log(`Writing ${versionJsPath}`);
fs.writeFileSync(versionJsPath, js);