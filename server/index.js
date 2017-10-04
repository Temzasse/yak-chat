/* eslint-disable  */

// Use esm for import/export syntax!
// https://github.com/standard-things/esm
require = require("@std/esm")(module, { cjs: true, esm: "js" })
module.exports = require("./main.js").default;

/* eslint-enable  */
