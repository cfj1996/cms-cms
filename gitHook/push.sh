#! /bin/bash
cd /root/woerk/cms_cms || exit
rm -rf /root/woerk/cms_cms/*
git clone -b developer https://git.tiancai.work/174/174-2.git
cd /root/woerk/cms_cms/174-2 || exit
yarn install
yarn build:test
cp -r /root/woerk/cms_cms/174-2/dist /root/woerk
rm -rf /root/woerk/cms_cms/*
rm -rf /root/woerk/dist || exit


