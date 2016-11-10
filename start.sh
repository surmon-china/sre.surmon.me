#!/bin/bash

LOG_PATH='/usr/local/wwwroot/logs'
NGINX_PATH='/usr/local/nginx/sbin'
DEPLOY_PATH='/usr/local/wwwroot/deploy'
NODEPRESS_PATH='/usr/local/wwwroot/nodepress'
 
echo "Start Nginx"
cd $NGINX_PATH
if ps aux | grep -v grep | grep -q nginx; then
    echo 'nginx has been started'
else
   ./nginx
fi;

echo "Start Nodepress Server"
cd $NODEPRESS_PATH
rm -f ${LOG_PATH}/nodepress/*.log
mkdir -p ${LOG_PATH}/nodepress
# pm2 stop nodepress &> ${LOG_PATH}/pm2.log
pm2 start index.js --name nodepress --watch -i max -e ${LOG_PATH}/nodepress/error.log -o ${LOG_PATH}/nodepress/out.log

echo "Start Deploy Server"
cd $DEPLOY_PATH
rm -f ${LOG_PATH}/deploy/*.log
mkdir -p ${LOG_PATH}/deploy
# pm2 stop deploy &> ${LOG_PATH}/pm2.log
pm2 start index.js --name deploy --watch -i max -e ${LOG_PATH}/deploy/error.log -o ${LOG_PATH}/deploy/out.log
echo "Finished."

