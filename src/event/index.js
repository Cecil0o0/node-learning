/*
 * @Author: Cecil
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-07-11 21:40:18
 * @Description node核心模块之一----事件
 */
'use strict'
// this is a class
const EventEmitter = require('events')

// define a Subscribe Container extends eventEmitter
class subContainer extends EventEmitter {}

// generate instance
const conInstance = new subContainer()

conInstance.on('test', function(msg) {
  console.log(msg, this === conInstance)
})

const func = function test(msg) {
  console.log('this won\'t be executed')
}
conInstance.on('willOff', func)

conInstance.once('once', function(msg) {
  console.log(msg)
})

// 为避免node进程exit()，监听error事件捕获该实例中抛出的异常
conInstance.on('error', () => {
  console.log('there was an error in conInstance')
})

// 打印已监听的事件名称集合
console.log(conInstance.eventNames())

// 取消监听事件
conInstance.off('willOff', func)
conInstance.emit('willOff', '测试off')

conInstance.emit('test', '这是一条msg')

conInstance.emit('once', '测试once')
conInstance.emit('once', '测试once')