const { path } = require('@vuepress/utils');

module.exports = {
  // 继承默认主题
  extends: '@vuepress/theme-default',

  // 覆盖 `404` 布局
  layouts: {
    404: path.resolve(__dirname, 'layouts/404.vue'),
    Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
  },
}
