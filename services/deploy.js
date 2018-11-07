/**
 * @file 部署服务
 * @module sre.surmon.me/deploy
 * @author Surmon <https://github.com/surmon-china>
 */

const consola = require('consola')
const projects = ['surmon.me', 'angular-admin', 'nodepress', 'deploy']

module.exports = (event, action) => {
  const branch = event.payload.ref
  const project = event.payload.repository.name
  const message = event.payload.head_commit.message || ''
  if (projects.includes(project) && message.includes('doDeploy')) {
    consola.info(new Date(), `收到一个关于项目 ${project} - ${branch} 分支的 ${action} 事件，要求服务端部署！`)
    shell.exec(`sh ../projects/${project}.sh`, (code, stdout, stderr) => {
      consola.info(new Date(), 'Exit code:', code)
      // consola.log(new Date(), 'Program output:', stdout)
      consola.info(new Date(), '执行完毕！错误信息：？', stderr)
    })
  }
}