#!/usr/bin/env sh
# 用于服务器的自动化部署

# 确保脚本抛出遇到的错误
set -e

# 进入到项目目录
cd `dirname $0`

echo "[1] 从服务器获取更新并更新依赖"
echo "$ git pull && yarn"

git pull && yarn


echo "[2] 编译生成静态文件"
echo "$ yarn docs:build"

yarn docs:build


## 使用 docker 部署
# 停止之前已经在运行的 docker
# docker stop meco || echo 'skip...'

# # build & run
# docker build --tag vue-deploy .

# docker run -d -p 80:80 --rm --name meco vue-deploy


## 使用本机服务部署，不使用 docker


echo "[3] 将资源文件复制到网站目录"
echo "$ yarn docs:build"

cp docs/.vuepress/dist/* /www/wwwroot/xerrors.fun/ -r

echo "点击访问：https://xerrors.fun"
