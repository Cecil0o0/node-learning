'use strict'
const prefix = 'A模块：'
module.exports = {a:1}
const b = require('./b.js')
console.log(prefix, b)  // {b:1}
module.exports = {a:2}
console.log(prefix, require.main === module)