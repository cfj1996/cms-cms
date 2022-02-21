#! /bin/bash
cd /root/woerk/cms_cms || exit
rm -rf /root/woerk/cms_cms/*
echo "clone"
git clone -b developer https://git.tiancai.work/174/174-2.git
cd /root/woerk/cms_cms/174-2 || exit
echo "安装包"
yarn install
echo "build"
yarn build:test || exit
if [ -d "/root/woerk/dist/" ]; then
    echo "删除dist"
    rm -rf /root/woerk/dist
fi
cp -r /root/woerk/cms_cms/174-2/dist /root/woerk
rm -rf /root/woerk/cms_cms/*
