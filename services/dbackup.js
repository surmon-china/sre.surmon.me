/**
 * @file 备份服务
 * @module sre.surmon.me/dbbackup
 * @author Surmon <https://github.com/surmon-china>
 */

const path = require('path')
const qiniu = require('qiniu')
const shell = require('shelljs')
const { argv } = require('yargs')
const moment = require('moment')
const consola = require('consola')
const schedule = require('node-schedule')

const FILE_EXT = '.tar.gz'
const BACK_CMD_SHELL = path.join(__dirname, '..', 'wwwcmd') + 'dbbbbackup.sh'
const BACK_DATA_PACK = path.join(__dirname, '..', 'wwwbak') + 'nodepress' + FILE_EXT

const UPFAILE_TIMEOUT = 1000 * 60 * 5
const UPLOAD_INTERVAL = '10 0 0 * * *'

console.log('BACK_CMD_SHELL', BACK_CMD_SHELL, 'BACK_DATA_PATH', BACK_DATA_PATH)

// Qiniu Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = argv.dbbackup_qiniu_accessKey
qiniu.conf.SECRET_KEY = argv.dbbackup_qiniu_secretKey

// Qiniu bucket
const bucket = argv.dbbackup_qiniu_bucket

// get qiniu token
const getUptoken = (bucket, fileName) => {
  const putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + fileName)
  return putPolicy.token()
}

// do upload
const uploadFile = (fileName, localFilePath) => {

  // get token
  const uptoken = getUptoken(bucket, fileName)
  consola.ready('Qiniu token ok!')

  // upload file
  const extra = new qiniu.io.PutExtra()
  qiniu.io.putFile(uptoken, fileName, localFilePath, extra, (err, ret) => {
    if (err) {
      consola.warn('备份数据上传失败!', err)
      setTimeout(backupAndPack, UPFAILE_TIMEOUT)
    } else {
      consola.success('备份数据上传成功!', ret.hash, ret.key, ret.persistentId)     
    }
  })
}

consola.ready('Qiniu sdk ok!')

// 打包备份任务
const backupAndPack = () => {
  shell.exec(`sh ${BACK_CMD_SHELL}`, (code, stdout, stderr) => {
    consola.info('dbbbbackup.sh 执行完成！', code, stdout, stderr)
    const fileDate = moment(new Date()).format('YYYY-MM-DD-hh:mm:ss')
    const fileName = `/nodepress/backup-${fileDate}${FILE_EXT}`
    consola.info('上传文件: ' + fileName)
    uploadFile(fileName, BACK_DATA_PACK)
  })
}

// 定时任务
schedule.scheduleJob(UPLOAD_INTERVAL, backupAndPack)
