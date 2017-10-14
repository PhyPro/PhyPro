#! /usr/local/bin/node
'use strict'
let shell = require('shelljs'),
    path = require('path')

let args = process.argv.slice(2).join(' ')
let path2phypro = path.resolve(__dirname, 'phypro.js')
let path2bunyan = path.resolve(__dirname, '..', 'node_modules/.bin/bunyan')

shell.exec('node ' + path2phypro + ' ' + args + ' | ' + path2bunyan + ' --color')
