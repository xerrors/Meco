#!/usr/bin/env sh
# 用于服务器的自动化部署

# 进入到项目目录
cd `dirname $0`

git pull

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 停止之前已经在运行的 docker
docker stop meco || echo 'skip...'

# build & run
docker build --tag vue-deploy .

docker run -d -p 80:80 --rm --name meco vue-deploy

echo "访问：http://xerrors.fun"
