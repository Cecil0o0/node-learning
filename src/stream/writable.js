/*
 * @Author: Cecil
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-07-05 22:19:15
 * @Description 可写流Demo
 */
'use strict'
const fs = require('fs')

const writable = fs.createWriteStream(__dirname + '/test.txt', {
  flags: 'w+',
  mode: 0666,
  encoding: 'utf8',
  autoClose: true,
  highWaterMark: 16
})

// 挂起buffer
// writable.cork()

console.log(writable.writableHighWaterMark)

if (writable.writable) {
  for (var i = 0; i < 20; i++) {
    // synchrounously
    // 未执行writable.uncork()且数据量小于hightWaterMark时数据还存在buffer
    console.log(`第${i}次write to buffer: `, writable.write(`${i}-this is a test txt file.!!!!\n`, 'utf8'))
    if (i === 10) {
      // 释放buffer
      writable.uncork()
    }
  }
}

// 需要在write之前监听

writable.on('open', () => {
  console.log('opened')
})

writable.on('error', err => {
  console.log(err)
})

writable.on('close', () => {
  console.log('closed')
})

writable.on('drain', () => {
  // buffer is drained（缓冲清空，缓冲可用）
  console.log('drained')
})

function writeMillonOrMoreTimes (writableStream, data, encoding, callback) {
  let i = 10
  write()

  function write() {
    let ok = true
    do {
      i--
      if (i === 0) {
        writableStream.write(data, encoding, callback)
      } else {
        // 尝试写流
        ok = writableStream.write(data, encoding)
      }
    } while(i > 0 && ok)
    // 如果没读完且此次读取失败了，则监听writerStream的drain事件，触发后继续write直到次数用尽
    if (i > 0) {
      writableStream.once('drain', write)
    }
  }
}

writeMillonOrMoreTimes(writable, '中文字符\n', 'utf8', () => {
  console.log('all data has been written')
})