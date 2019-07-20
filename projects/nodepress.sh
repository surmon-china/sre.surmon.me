#!/bin/bash
 
WEB_PATH='/usr/local/wwwroot/nodepress'
WEB_USER='root'
WEB_USERGROUP='root'
 
echo "Start deployment nodepress"
cd $WEB_PATH
echo "pulling source code..."
# git reset --hard origin/master
# git clean -f
git pull -f
git checkout master
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
chmod -R 777 $WEB_PATH
sudo pm2 stop surmon.me
pm2 stop nodepress
sync && echo 3 | sudo tee /proc/sys/vm/drop_caches
rm -rf ./dist/*
npm run build
sync && echo 3 | sudo tee /proc/sys/vm/drop_caches
pm2 restart nodepress
sudo pm2 restart surmon.me
echo "Finished."
