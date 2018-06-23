const prefix = '主模块：'
const a = require('./a.js')

console.log(prefix, a)  // {a:2}
console.log(prefix, require.main === module)
console.log(module)