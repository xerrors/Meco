const { path } = require('@vuepress/utils');

function getConfig() {
  const config = {
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
      sidebar: 'auto',
      editLink: false,
      lastUpdated: false,
      contributors: false,

      navbar: [
        { text: "测试", link: "/test" },
        { text: "博客", link: "/blogs" },
        { text: "动态", link: "/zone" },
        { 
          text: "下拉",
          children: [
            { text: "关于", link: "/about" },
            { text: "友链", link: "/friends" },
          ]
        }
      ],
    },

    plugins: [
      // ['@vuepress/plugin-debug']
    ],

    alias: {
      '@components': path.resolve(__dirname, './components'),
      '@assets': path.resolve(__dirname, './assets'),
      '@src': path.resolve(__dirname, '.'),
    },

    bundler: '@vuepress/vite',
    bundlerConfig: {
      viteOptions: {
        optimizeDeps: {
          exclude: [
            '@vueuse/core',
          ],
        },
      },
    },
  }
  return config;
}

module.exports = getConfig();