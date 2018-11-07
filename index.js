/**
 * @file 运维服务
 * @module sre.surmon.me
 * @author Surmon <https://github.com/surmon-china>
 */

const fs = require('fs')
const http = require('http')
const { argv } = require('yargs')
const consola = require('consola')
const shell = require('shelljs')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/deploy', secret: argv.deploy_secret })
const deployHandler = require('./services/deploy')
const html = fs.readFileSync('index.html')
const port = 9988

// http server
http.createServer((req, res) => {
  handler(req, res, _ => {
    if (req.url !== '/deploy') {
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': html.length
      })
      res.write(html)
    }
    res.end()
  })
}).listen(port, () => {
  consola.ready(`Deploy server Run！port at ${port}`, new Date())
  shell.exec('echo shell test OK!')
})

handler.on('push', event => { deployHandler(event, 'push') })
handler.on('commit_comment', event => { deployHandler(event, 'commit') })
handler.on('error', err => {
  consola.warn('Sre handler error:', err.message, new Date())
})
