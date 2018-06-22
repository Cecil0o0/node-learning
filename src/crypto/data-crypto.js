const crypto = require('crypto')
const fs = require('fs')
// aesKey
const aesKey = 'abcdefghijklmnop'
// iv
const iv = '0000000000000000'
// privateKey
const privateKey = fs.readFileSync('rsa_private_key_pkcs8.pem').toString()
// publicKey
const publicKey = fs.readFileSync('rsa_public_key.pem').toString()
// 创建加密类实例
const cipheriv = crypto.createCipheriv('aes-128-cbc', aesKey, iv)
// 结果数据结构
let res = {
  encryptedData: '',
  publicKey,
  encryptedKey: '',
  iv
}

// aes加密过程
let promiseHandler = null
let cryptoPromise = new Promise((resolve, reject) => {
  promiseHandler = resolve
})
cipheriv.on('readable', () => {
  const data = cipheriv.read()
  if (data) res.encryptedData += data.toString('hex')
})

cipheriv.on('end', () => {
  res.encryptedData = res.encryptedData
  console.log(`aes加密后的密文为：${res.encryptedData}`)
  promiseHandler()
})

cipheriv.write('狼牙月，伊人憔悴。忍字诀，几番轮回。')
cipheriv.end()

// 验证公私钥对是否匹配
const sign = crypto.createSign('SHA256')

sign.write(aesKey)
sign.end()
let signed = sign.sign(privateKey, 'base64')
const verify = crypto.createVerify('SHA256')

verify.write(aesKey)
verify.end()

console.log(`aesKey签名结果为：${signed}`)
console.log(`公私钥是否匹配：${verify.verify(res.publicKey, signed, 'base64')}`)

// 数字签名
res.encryptedKey = crypto.privateEncrypt(privateKey, Buffer.from(aesKey, 'utf8')).toString('base64')
console.log(`私钥加密为：${res.encryptedKey}`)
// 公钥解密
let decryptedKey = crypto.publicDecrypt(res.publicKey, Buffer.from(res.encryptedKey, 'base64'))
console.log(`公钥解密为：${decryptedKey}`)

// 利用key和iv去解密res.encryptedData
let deCipheriv = crypto.createDecipheriv('aes-128-cbc', decryptedKey, res.iv)
let decrypted = ''
deCipheriv.on('readable', () => {
  const data = deCipheriv.read()
  if (data) decrypted += data.toString('utf8')
})
deCipheriv.on('end', () => {
  console.log(`aes解密后的明文为：${decrypted}`)
})

cryptoPromise.then(() => {
  deCipheriv.write(res.encryptedData, 'hex')
  deCipheriv.end()
})