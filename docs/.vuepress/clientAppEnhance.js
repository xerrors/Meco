import { defineClientAppEnhance } from '@vuepress/client';
import Loading from '@components/global/Loading.vue';
import '@src/styles/index.scss';
export default defineClientAppEnhance(({ app }) => {
    /* eslint-disable vue/match-component-file-name */
    app.component('Loading', Loading);
});
