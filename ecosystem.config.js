module.exports = {
  apps: [
    {
      watch: true,
      script: "index.js",
      name: "sre.surmon.me",
      max_memory_restart: "68M",
      args: [
        "--deploy_secret=your_github_secret"
      ],
      error_file: "/usr/local/wwwlogs/sre.surmon.me/error.log",
      out_file: "/usr/local/wwwlogs/sre.surmon.me/out.log"
    }
  ]
}