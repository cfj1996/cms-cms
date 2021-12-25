#! /bin/bash
cd /root/woerk/174-2 || exit

echo "start git checkout"
git checkout developer

echo "start git pull"
git pull

echo "install package"
yarn install

echo "build app"

yarn build
echo "打包完成"



