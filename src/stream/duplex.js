/*
 * @Author: Cecil
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-07-05 22:18:29
 * @Description UDP连接是一个典型的duplex stream
 */
'use strict'
const dgram = require('dgram')
const server = dgram.createSocket('udp4')

server.on('error', err => {
  console.log(`server error:\n${err.stack}`)
  server.close()
})

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
})

server.on('listening', () => {
  const address = server.address()
  console.log(`server listening ${address.address}:${address.port}`)
})

server.bind(12346)

server.send('hello', 12345, '0.0.0.0', () => {
  console.log('msg has been sent')
})

const buf1 = Buffer.from(require('fs').readFileSync(__dirname + '/test.txt'))

server.send(buf1, 12345, '0.0.0.0')
