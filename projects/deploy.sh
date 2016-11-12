#!/bin/bash
 
WEB_PATH='/usr/local/wwwroot/deploy'
WEB_USER='root'
WEB_USERGROUP='root'
 
echo "Start deployment deploy"
cd $WEB_PATH
echo "pulling source code..."
# git reset --hard origin/master
# git clean -f
git pull
git checkout master
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "Finished."
