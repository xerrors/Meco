const { path } = require('@vuepress/utils');

function getConfig() {
  const config = {
    head: [
      ["meta", { name: "keywords", content: "meco" }],
      // ["meta", { 'http-equiv': "Content-Security-Policy", content: "upgrade-insecure-requests" }],
      ['link', { rel: 'manifest', href: '/manifest.json' }],
      ['script', { src: '/font.js', type: 'application/javascript' }],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ],
    lang: 'zh-CN',
    title: 'Meco',
    description: '个人博客网站',
    // theme: path.resolve(__dirname, './theme'),

    themeConfig: {
      sidebar: 'auto',
      editLink: false,
      lastUpdated: false,
      contributors: false,

      navbar: [
        { text: "博客", link: "/blogs/" },
        { text: "动态", link: "/zone/" },
        { text: "关于", link: "/about/" },
        { text: "友链", link: "/friends/" },
      ],
    },

    plugins: [
      ['@vuepress/medium-zoom', {
        selector: ':not(a) > img:not(.no-zoom)',
        // medium-zoom options here
        // See: https://github.com/francoischalifour/medium-zoom#options
      }],
      ['@maginapp/vuepress-plugin-katex', {
        delimiters: 'dollars',
      }]
    ],

    // extendsMarkdown: (md) => {
    //   md.use(require('@iktakahiro/markdown-it-katex'));
    // },

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