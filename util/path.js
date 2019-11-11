const path = require("path");
// console.log(process.mainModule.filename);
// console.log(path.resolve("app"));
module.exports = path.dirname(process.mainModule.filename);
