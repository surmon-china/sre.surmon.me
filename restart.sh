#!/bin/bash

pm2 stop all
pm2 delete all

echo "---Pm2 stop and delete all project success!"

nginx -s stop

echo "---Nginx stop success!"

. ./start.sh
