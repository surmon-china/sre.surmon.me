#!/bin/bash
 
WEB_PATH='/usr/local/wwwroot/surmon.me'
WEB_USER='root'
WEB_USERGROUP='root'
 
echo "Start deployment Surmon.me"
cd $WEB_PATH
echo "pulling source code..."
# git reset --hard origin/release
# git clean -f
git pull
git checkout master
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
pm2 delete nodepress
pm2 delete surmon.me
npm run build && pm2 start ecosystem.config.js
pm2 start /usr/local/wwwroot/nodepress/ecosystem.config.js
echo "Finished."
