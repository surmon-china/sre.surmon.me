const http = require('http')
const exec = require('exec')

const PORT = 9988
const PATH = {
  vue: '../vue-blog',
  admin: '../angular-admin',
  nodepress: 'NodePress'
}

const deployServer = http.createServer((request, response) => {
  if (request.url.search(/deploy\/?$/i) > 0) {

    let dir = PATH.vue
    const commands = [`cd ${dir}`, '', 'git pull'].join(' && ')

    console.log(commands)
    console.log(request)

    exec(commands,(err, out, code) => {
      if (err instanceof Error) {
        response.writeHead(500)
        response.end('Server Internal Error.')
        throw err
      }
      process.stderr.write(err)
      process.stdout.write(out)
      response.writeHead(200)
      response.end('Deploy Done.')
    })

  } else {
    response.writeHead(404)
    response.end('Not Found.')
  }
})

deployServer.listen(PORT)