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

  themeConfig: {
    // logo: 'https://vuejs.org/images/logo.png',
  },

  bundler: '@vuepress/vite',
  bundlerConfig: {
     // vite 打包工具的选项
  },
}
