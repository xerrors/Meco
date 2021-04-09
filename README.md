这是基于 vuepress v2 的默认主题开发的博客网站，为了便于后续更新，尽量不对原始主题进行修改

目前还存在的问题

1. 主题的配置需要修改
2. css 变量的修改和适配
3. 路由如何使用，似乎用不到
4. 如何获取所有的文章，目前从后端取出
5. 【实现】首页打字机效果 [ityped](https://www.shejidaren.com/ityped.html)

已知bug

- 【已解决】首页的照片应该在屏幕尺寸变化后变化大小，使用 breakpoints
- permalink 仅支持 /***/ 形式
- 动态页面 token 的输入框布局问题
- 首页的 medium-zoom 设置不可缩放之后，刷新网页又会缩放
- 公式显示不正确，插件尚未支持 vuepress2
- 将博客页面的文章选择在新标签页打开


## Docker 部署

使用 docker 可以方便的在服务器上部署，首先 clone 此项目：

```sh
git clone https://github.com/Xerrors/Meco.git

cd Meco
```

### 1. 直接部署

首先此项目的目录下面创建一个 Dockerfile，内容如下。

```dockerfile
# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app

COPY package.json ./
RUN yarn

COPY . .
RUN yarn docs:build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/docs/.vuepress/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

然后 build 一个镜像，并启动这个镜像：

```sh
docker build --tag vuepress-docker .

docker run -d -p 80:80 --rm vuepress-docker --name meco
```

此时使用 http://127.0.0.1 就可以在本地访问到，如果是在服务器上面，使用服务器的 IP 地址即可。


### 2. 主机编译，然后部署到 docker

首先要确保主机已经有了 node (version>=12) 环境，然后创建一个 Dockerfile，内容如下：

```dockerfile
FROM nginx
MAINTAINER Xerrors <xerrors@163.com>


COPY docs/.vuepress/dist  /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

之后就可以直接运行部署的脚本就可以了：

```sh
bash deploy.sh
```

当然也可以手动编译并运行 docker，首先

```sh
docker build --tag vue-deploy .

docker run -d -p 80:80 --rm --name meco vue-deploy
```
