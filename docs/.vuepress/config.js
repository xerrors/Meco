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
    repo: 'xerrors/Meco',
    lang: 'zh-CN',
    title: 'Meco',
    description: '个人博客网站',
    theme: path.resolve(__dirname, './theme'),

    themeConfig: {
      sidebar: 'auto',
      editLink: false,
      lastUpdated: false,
      contributors: false,
      repo: 'xerrors/meco',
      repoLabel: "Meco",
      externalIcon: false,

      navbar: [
        { text: "博客", link: "/blogs/" },
        { text: "动态", link: "/zone/" },
        { text: "友链", link: "/friends/" },
        { text: "关于我", link: "/about/" },
      ],

      markdown: {
        links: false
      },
    },


    plugins: [
      [
        '@vuepress/medium-zoom', {
          // medium-zoom options here
          // See: https://github.com/francoischalifour/medium-zoom#options
          selector: ':not(a) > img:not(.no-zoom)',
        }
      ],

      [
        '@maginapp/vuepress-plugin-katex', {
          delimiters: 'dollars',
        }
      ],
      [
        '@vuepress/plugin-search',{
          apikey: 'aa84b05f0d5d94a913b915272c8a1401',
          indexName: 'dev-meco'
        },
      ],
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