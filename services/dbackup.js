/**
 * @file 备份服务
 * @module sre.surmon.me/dbbackup
 * @author Surmon <https://github.com/surmon-china>
 */

const qiniu = require('qiniu')
const shell = require('shelljs')
const consola = require('consola')
const schedule = require('node-schedule')

consola.ready('Qiniu sdk ok!')
consola.info('compress ok!')
consola.info('push ok!')
consola.info('move and rename ok!')
consola.success('Dbbackup done!')
