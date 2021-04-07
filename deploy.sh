#!/usr/bin/env sh
# 用于服务器的自动化部署

cd ~/meco

git pull

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist
cp -r ./* /www/wwwroot/www.xerrors.fun

echo -e "\n\t* 成功将资源文件复制到网站根目录 访问：https://www.xerrors.fun\n"