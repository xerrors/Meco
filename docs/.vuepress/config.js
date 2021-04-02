const { path } = require('@vuepress/utils');

module.exports = {
  head: [
    ["meta", { name: "keywords", content: "meco" }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['script', { src: '/font.js', type: 'application/javascript' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],
  lang: 'zh-CN',
  title: 'Meco',
  description: '个人博客网站',
  theme: path.resolve(__dirname, './theme'),

  themeConfig: {
    // logo: 'https://vuejs.org/images/logo.png',
    repo: 'xerrors/meco',
    sidebar: false,
    editLink: false,
    lastUpdated: false,

    navbar: [
      { text: "测试", link: "/pages/guide" },
      { text: "博客", link: "/pages/blogs" },
      { text: "动态", link: "/pages/zone" },
      { text: "关于", link: "/pages/about" },
      { text: "友链", link: "/pages/friends" },
    ],
  },

  plugins: [
    // ['@vuepress/plugin-debug']
  ],

  alias: {
    '@components': path.resolve(__dirname, './components'),
  },

  bundler: '@vuepress/vite',
  bundlerConfig: {
     // vite 打包工具的选项
  },
}
