const prefix = 'b模块：'
module.exports = {b:1}
const a = require('./a.js')
console.log(prefix, a) // {a:1}
console.log(prefix, require.main === module)