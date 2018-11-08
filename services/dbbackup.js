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
const BACK_CMD_SHELL = path.join(__dirname, '..', '..', 'wwwcmd') + '/dbbackup.sh'
const BACK_DATA_PACK = path.join(__dirname, '..', '..', 'wwwbak') + '/nodepress' + FILE_EXT

// const BACK_CMD_SHELL = path.join(__dirname, '..', 'test') + '/test.sh'
// const BACK_DATA_PACK = path.join(__dirname, '..', 'test') + '/test' + FILE_EXT

const UPFAILE_TIMEOUT = 1000 * 60 * 5
const UPLOAD_INTERVAL = '10 28 17 * * *'
// const UPLOAD_INTERVAL = '10 0 0 * * *'

// Qiniu Access Key 和 Secret Key
const accessKey = argv.dbbackup_qiniu_accessKey
const secretKey = argv.dbbackup_qiniu_secretKey
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// Qiniu bucket
const bucket = argv.dbbackup_qiniu_bucket
const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket })

// config
const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0
config.useHttpsDomain = false
config.useCdnDomain = false

const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

// do upload
const uploadFile = (fileName, localFilePath) => {

  // get token
  const uptoken = putPolicy.uploadToken(mac)
  consola.info('Qiniu token ok!')

  // upload file
  formUploader.putFile(uptoken, fileName, localFilePath, putExtra, (respErr, respBody, respInfo) => {
    if (respErr) {
      consola.warn('备份数据上传失败!', respErr)
      setTimeout(backupAndPack, UPFAILE_TIMEOUT)
    }
    if (respInfo.statusCode == 200) {
      consola.success('备份数据上传成功!', respBody.key)    
    } else {
      consola.warn('备份数据上传状态响应异常!', respInfo.statusCode, respBody)
    }
  })
}

consola.ready('Qiniu sdk ok!')

// 打包备份任务
const backupAndPack = () => {
  shell.exec(`sh ${BACK_CMD_SHELL}`, (code, stdout, stderr) => {
    consola.info('dbbackup.sh 执行完成！', code, stdout, stderr)
    const fileDate = moment(new Date()).format('YYYY-MM-DD-HH:mm')
    const fileName = `/nodepress/backup-${fileDate}${FILE_EXT}`
    consola.info('上传文件: ' + fileName)
    consola.info('文件源位置: ' + BACK_DATA_PACK)
    uploadFile(fileName, BACK_DATA_PACK)
  })
}

// 定时任务
const scheduleBackup = () => {
  consola.start('开始执行定时备份任务！')
  schedule.scheduleJob(UPLOAD_INTERVAL, backupAndPack)
}

module.exports = scheduleBackup
