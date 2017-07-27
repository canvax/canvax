const fs = require('fs');
const pkg = require('./package.json');

let canvax_iife = fs.readFileSync('/dist/canvax.js', 'utf8');
canvax_iife = canvax_iife.replace(/{{PKG_VERSION}}/g, pkg.version);

fs.writeFile('/dist/canvax.js', canvax_iife, 'utf8', (err) => {
  if (err) {
    throw err;
  }
  console.log('String Replaced!');
});