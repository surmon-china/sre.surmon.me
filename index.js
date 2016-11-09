const http = require('http')
const exec = require('exec')

const port = 9988
const projects = ['vue-blog', 'angular-admin', 'NodePress']

const deployServer = http.createServer((request, response) => {
  const url = request.url
  const project = url.split('/deploy/')[1]
  // console.log(url)
  // console.log(project)
  if (url.includes('/deploy') && projects.includes(project)) {

    const commands = [`cd ../${project}`, 'git pull'].join(' && ')
    console.log(commands)
    // console.log(request.url)

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
      console.log(new Date(), '执行成功！')
    })

  } else {
    response.writeHead(404)
    response.end('Not Found.')
  }
})

deployServer.listen(port)