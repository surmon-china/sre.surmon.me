const http = require('http')
const shell = require('shelljs')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: 'surmon' })
// 上面的 secret 保持和 GitHub 后台设置的一致

const port = 9988
const projects = ['surmon.me', 'angular-admin', 'nodepress', 'deploy']

const projectHandler = (event, action) => {
	const project = event.payload.repository.name
	const branch = event.payload.ref
	if (projects.includes(project)) {
		console.log(new Date(), `Received a ${action} event for ${project} to ${branch}`)
		shell.exec(`sh ./projects/${project}.sh`, (code, stdout, stderr) => {
		  console.log(new Date(), 'Exit code:', code)
		  // console.log(new Date(), 'Program output:', stdout)
		  console.log(new Date(), '执行完毕！错误信息：？', stderr)
		})

	}
}

http.createServer((req, res) => {
	handler(req, res, err => {
		res.statusCode = 404
		res.end('no such location')
	})
}).listen(port, () => {
  console.log(new Date(), `Deploy server Run！port at ${port}`)
  shell.exec('echo shell test OK!', (code, stdout, stderr) => {
	  // console.log('Exit code:', code)
	  // console.log('Program output:', stdout)
	  // console.log('Program stderr:', stderr, stderr === '', !!stderr)

  })
})

handler.on('error', err => {
	console.error('Error:', err.message)
})

handler.on('push', event => { projectHandler(event, 'push') })
handler.on('commit_comment', event => { projectHandler(event, 'commit') })

