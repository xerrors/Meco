import { defineClientAppEnhance } from '@vuepress/client';
import Comment from './components/global/Comment.vue';
import Loading from './components/global/Loading.vue';
import './styles/index.scss';
export default defineClientAppEnhance(({ app }) => {
    /* eslint-disable vue/match-component-file-name */
    app.component('Comment', Comment);
    app.component('Loading', Loading);
});
