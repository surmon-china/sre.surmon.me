# release-server
用于linux项目下自动热部署

```bash
pm2 start index.js --name deploy --watch -i max -e ./logs/deploy/error.log -o ./logs/deploy/out.log
```
