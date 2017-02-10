module.exports = {
  apps: [
    {
      name: "deploy",
      watch: true,
      script: "index.js",
      error_file: "/usr/local/wwwlogs/surmon.me/error.log",
      out_file: "/usr/local/wwwlogs/surmon.me/out.log"
    }
  ]
}