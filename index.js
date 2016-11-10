const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: 'surmon' })
// 上面的 secret 保持和 GitHub 后台设置的一致

const commands = (cmd, args, callback) => {
	const spawn = require('child_process').spawn
	const child = spawn(cmd, args)
	let resp = ''
	child.stdout.on('data', buffer => {
		resp += buffer.toString()
	})
	child.stdout.on('end', () => {
		callback(resp)
	})
}

http.createServer((req, res) => {
	handler(req, res, err => {
		res.statusCode = 404
		res.end('no such location')
	})
}).listen(9988)

handler.on('error', err => {
	console.error('Error:', err.message)
})

handler.on('push', event => {
	console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref)
		// commands('sh', ['./deploy-dev.sh'], text => { console.log(text) })
})

handler.on('commit_comment', event => {
	console.log(event)
	console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref)
		// commands('sh', ['./deploy-dev.sh'], text => { console.log(text) })
})

/*
handler.on('issues', event => {
  console.log('Received an issue event for % action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
*/