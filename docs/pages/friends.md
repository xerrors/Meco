---
title: 小伙伴
permalink: /friends/
sidebar: false
---

<FriendPage />

<script>
import { defineComponent } from 'vue'
import FriendPage from '@components/FriendPage.vue'
export default defineComponent({
  name: 'Friend',
  components: {
    FriendPage
  },
})
</script>