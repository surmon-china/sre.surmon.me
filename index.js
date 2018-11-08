/**
 * @file 运维服务
 * @module sre.surmon.me
 * @author Surmon <https://github.com/surmon-china>
 */

const PORT = 9988
const DEPLOY_ROUTE = '/deploy'

const fs = require('fs')
const http = require('http')
const { argv } = require('yargs')
const consola = require('consola')
const shell = require('shelljs')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: DEPLOY_ROUTE, secret: argv.deploy_secret })
const deployHandler = require('./services/deploy')
const scheduleBackup = require('./services/dbbackup')
const html = fs.readFileSync('index.html')

// schedule backup
scheduleBackup()

// http server
http.createServer((req, res) => {
  handler(req, res, _ => {
    if (req.url !== DEPLOY_ROUTE) {
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': html.length
      })
      res.write(html)
    }
    res.end()
  })
}).listen(PORT, () => {
  consola.ready(`Deploy server Run！port at ${PORT}`, new Date())
  shell.exec('echo shell test OK!')
})

handler.on('push', event => { deployHandler(event, 'push') })
handler.on('commit_comment', event => { deployHandler(event, 'commit') })
handler.on('error', err => {
  consola.warn('Sre handler error:', err.message, new Date())
})
