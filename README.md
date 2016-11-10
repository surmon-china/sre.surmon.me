# release-server
用于linux项目下自动热部署

```bash
forever -p . -l ./logs/server.log -e ./logs/error.log -o ./logs/out.log -a -w start index.js
```
