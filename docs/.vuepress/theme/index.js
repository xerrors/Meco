import './styles/index.scss';

module.exports = {
  // 继承默认主题
  extends: '@vuepress/theme-default',

  // 覆盖 `404` 布局
  layouts: {
    // 404: path.resolve(__dirname, './components/404.vue'),
  },
}
