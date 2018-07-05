/*
 * @Author: Cecil
 * @Last Modified by: Cecil
 * @Last Modified time: 2018-07-05 22:19:05
 * @Description zlib.createGzip() 生成了一个典型的transform stream
 */
'use strict'
const fs = require('fs')
const zlib = require('zlib')

// It's also a stream instance, so it can use .pipe method, and this is a transform type stream
const GZIP = zlib.createGzip()

fs.createReadStream(__dirname + '/test.txt').pipe(GZIP).pipe(fs.createWriteStream(__dirname + '/test.txt.gz'), {
  flags: 'w+'
})