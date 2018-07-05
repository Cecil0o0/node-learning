/*
 * @Author: Cecil
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-07-05 22:00:20
 * @Description 可读流Demo
 */
'use strict'

// 两种运行时模式（flowing, pause）

const fs = require('fs')

const readable = fs.createReadStream(__dirname + '/test.txt', {
  flags: 'r',
  encoding: 'utf8',
  highWaterMark: 256, // bytes. min = 16
  autoClose: true,
  start: 3, // bytes. default 0
  end: Infinity
})

readable.on('open', res => {
  console.log('opened')
})

// here readable is under 'pause' mode, and readable.readableFlowing is null, because there is no mechanism for consuming stream data

console.log(readable.read(10)) // here result is null, because the stream is not worked at this time, therefore there is none in buffer to read

let count = 0

readable.on('data', chunk => {
  console.log(count++)
  console.log('handler 1:', chunk)
})

// readable.on('data', chunk => {
//   console.log('handler 2:', chunk)
// })

// here readable is under 'flowing' mode, and readable.readableFlowing is true. when nodejs is running to Event Loop, nodejs asked one worker thread in Worker Thread Pool to read from file, and subscribe the 'data' event wating for callback, worker thread will as quick as possible to execute readable._read() and then emitter 'data' event with file chunk countinously, finally, 'data' handlers will execute one by one synchronously in Event Loop 'poll' phase

// readable.pause()
// here readable is under 'pause' mode, wouldn't work

readable.on('end', res => {
  console.log('end')
})

readable.on('close', () => {
  console.log('closed')
})

readable.on('error', err => {
  console.log(err)
})

// readable.destroy()

process.nextTick(() => {
  // 向可读流push数据（向后插数据）
  readable.push('sadjadhajkshdk')
  // 向可读流unshift数据（向前插数据）
  readable.unshift('unshifted\n')
})

let writable = fs.createWriteStream(__dirname + '/test-copy.txt', 'utf8')

readable.pipe(writable)