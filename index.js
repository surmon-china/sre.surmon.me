const http = require('http')
const exec = require('exec')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: 'surmon' })
// 上面的 secret 保持和 GitHub 后台设置的一致

const port = 9988
const projects = ['vue-blog', 'angular-admin', 'nodepress']

/*
const commands = (cmd, args, callback) => {
	const spawn = require('child_process').spawn
	const child = spawn(cmd, args)
	let resp = ''
	child.stdout.on('data', buffer => { resp += buffer.toString() })
	child.stdout.on('end', () => { callback(resp) })
}
*/

const projectHandler = (event, action) => {
	const project = event.payload.repository.name
	const branch = event.payload.ref
	if (projects.includes(project)) {
		console.log(`Received a ${action} event for ${project} to ${branch}`)
		// commands('sh', [`./projects/${project}.sh`], text => { console.log(text) })
		exec(`sh ./projects/${project}.sh`,(err, out, code) => {
		      if (err instanceof Error) {
			// throw err
			return console.log('执行失败！', new Date())
		      }
		      process.stderr.write(err)
		      process.stdout.write(out)
		      console.log('执行成功！', new Date())
		})
	}
}

http.createServer((req, res) => {
	handler(req, res, err => {
		res.statusCode = 404
		res.end('no such location')
	})
}).listen(port, () => {
  console.log(`Deploy server Run！port at ${port}`)
})

handler.on('error', err => {
	console.error('Error:', err.message)
})

handler.on('push', event => { projectHandler(event, 'push') })
handler.on('commit_comment', event => { projectHandler(event, 'commit') })

