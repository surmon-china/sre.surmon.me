module.exports = {
  apps: [
    {
      watch: true,
      script: "index.js",
      name: "sre.surmon.me",
      max_memory_restart: "68M",
      args: [
        "--deploy_secret=your_github_secret",
        "--dbbackup_qiniu_accessKey=your_qiniu_accessKey",
        "--dbbackup_qiniu_secretKey=your_qiniu_secretKey",
        "--dbbackup_qiniu_bucket=your_qiniu_bucket"
      ],
      error_file: "/usr/local/wwwlogs/sre.surmon.me/error.log",
      out_file: "/usr/local/wwwlogs/sre.surmon.me/out.log"
    }
  ]
}