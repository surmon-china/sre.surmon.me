const http = require('http')
const exec = require('exec')

const port = 9988
const projects = ['vue-blog', 'angular-admin', 'nodepress']

const deployServer = http.createServer((request, response) => {
  const url = request.url
  const project = url.split('/')[1]
  // console.log(url)
  // console.log(project)
  if (url.includes('/') && projects.includes(project)) {

    const commands = [`cd ../${project}`, 'git pull'].join(' && ')
    console.log('执行命令', commands)
    // console.log(request.url)

    exec(commands,(err, out, code) => {
      if (err instanceof Error) {
        response.writeHead(500)
        response.end('Server Internal Error.')
        // throw err
        return console.log('执行失败！', new Date())
      }
      process.stderr.write(err)
      process.stdout.write(out)
      response.writeHead(200)
      response.end('Deploy Done.')
      console.log('执行成功！', new Date())
    })

  } else {
    response.writeHead(404)
    response.end('Not Found.')
  }
})

deployServer.listen(port)
