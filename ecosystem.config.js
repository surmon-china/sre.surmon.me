module.exports = {
  apps: [
    {
      name: "deploy",
      watch: true,
      script: "index.js",
      error_file: "/usr/local/wwwlogs/deploy/error.log",
      out_file: "/usr/local/wwwlogs/deploy/out.log"
    }
  ]
}