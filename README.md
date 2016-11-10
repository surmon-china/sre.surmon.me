# release-server
用于linux项目下自动热部署

```bash
forever -p . -l ./server.log -e ./error.log -o ./out.log -a -w start index.js
```
