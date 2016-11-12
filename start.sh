#!bin/bash

LOG_PATH='/usr/local/wwwroot/logs'
DEPLOY_PATH='/usr/local/wwwroot/deploy'
NODEPRESS_PATH='/usr/local/wwwroot/nodepress'

echo "---Start Nginx"
if ps aux | grep -v grep | grep -q nginx; then
   nginx -s reload
   echo "---Nginx reload success!"
else
   nginx
   echo "---Nginx start success!"
fi;

echo "---Start Nodepress Server"
cd $NODEPRESS_PATH
rm -f ${LOG_PATH}/nodepress/*.log
mkdir -p ${LOG_PATH}/nodepress
pm2 start index.js --name nodepress --watch -i max -e ${LOG_PATH}/nodepress/error.log -o ${LOG_PATH}/nodepress/out.log
echo "---Nodepress run success!"


echo "---Start Deploy Server"
cd $DEPLOY_PATH
rm -f ${LOG_PATH}/deploy/*.log
mkdir -p ${LOG_PATH}/deploy
pm2 start index.js --name deploy --watch -i max -e ${LOG_PATH}/deploy/error.log -o ${LOG_PATH}/deploy/out.log
echo "---Deploy server run success!"
echo "---Finished."


