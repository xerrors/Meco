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


### 如何在 docker 中启动

```sh
git clone https://github.com/Xerrors/Meco.git

cd Meco

docker build --tag vuepress-docker .

docker run -d -p 80:80 --rm vuepress-docker
```