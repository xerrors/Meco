<template>
  <div class="shuffler-container">
    <button class="pre" @click="shuffler.pre"><LeftOutlined /></button>
    <button class="next" @click="shuffler.next"><RightOutlined /></button>
    <div
      class="shuffler-images"
      :style="{
        width: sliderArray.length * 100 + '%',
        marginLeft: -shuffler.index * 100 + '%',
      }"
    >
      <span
        v-for="(item, i) of sliderArray"
        :key="i"
        @mouseleave="shuffler.autoStart"
        @mouseenter="shuffler.autoStop"
      >
        <a :href="item.link" target="_blank"><img :src="item.cover" alt="" /></a>
      </span>
    </div>
    <div class="action-dots">
      <div
        v-for="(item, ind) of sliderArray"
        :class="{ active: ind === shuffler.index }"
        :key="ind"
        @click="shuffler.index = ind"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, toRefs } from "vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "Slider",
  props: {
    sliderArray: {
      require: true,
      type: Array,
    },
  },
  components: {
    LeftOutlined,
    RightOutlined,
  },
  setup(props) {
    var timerInt = null;
    var timeOut = null;

    const { sliderArray } = toRefs(props);

    function next() {
      shuffler.autoStop();
      shuffler.index = (shuffler.index + 1) % sliderArray.value.length;
      shuffler.autoStart();
    }

    function pre() {
      shuffler.autoStop();
      shuffler.index =
        (shuffler.index + sliderArray.value.length - 1) %
        sliderArray.value.length;
      shuffler.autoStart();
    }

    function autoStart() {
      if (!timerInt) {
        timerInt = setInterval(() => {
          shuffler.index = (shuffler.index + 1) % sliderArray.value.length;
        }, 6000);
      }
    }

    function autoStop() {
      clearInterval(timerInt);
      timerInt = null;
    }

    const shuffler = reactive({
      index: 0,
      autoStart: autoStart,
      autoStop: autoStop,
      next: next,
      pre: pre,
    });

    onMounted(() => {
      setTimeout(shuffler.autoStart, 6000);
    })

    return {
      shuffler,
      sliderArray,
    };
  },
});
</script>

<style lang="scss" scoped>
.shuffler-container {
  position: relative;
  width: 100%;
  height: 100%;

  button {
    display: none;
    height: 36px;
    width: 36px;
    position: absolute;
    border: none;
    outline: none;
    border-radius: 50%;
    background: white;
    top: calc(50% - 18px);
    // transform: translateY(-50%);
    cursor: pointer;
    transition: 0.3s; /** 不起作用 */
  }

  .pre {
    left: 30px;
    animation: fade-in-left 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }

  .next {
    right: 30px;
    animation: fade-in-right 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }

  &:hover {
    button {
      display: inline-block;
    }

    .action-dots {
      opacity: 1;
      visibility: visible;
    }
  }

  .shuffler-images {
    height: 100%;
    transition: margin 0.5s ease-in-out;
    display: flex;
    margin-top: 0;
    cursor: pointer;

    span {
      width: 100%;
    }

    img {
      width: 100%;
      object-fit: cover;
      height: 100%;
    }
  }

  .action-dots {
    position: absolute;
    bottom: 16px;
    width: 100%;
    display: flex;
    opacity: 0;
    visibility: hidden;
    justify-content: center;
    transition: all 0.3s ease-in-out;

    div {
      width: 10px;
      height: 10px;
      cursor: pointer;
      margin: 0 3px;
      border-radius: 50%;
      opacity: .48;
      background: #fff;
    }

    div.active {
      opacity: 1;
    }
  }
}

ul,
ol {
  padding-left: 0;
}

ul,
li {
  list-style: none;
}

/* ----------------------------------------------
 * Generated by Animista on 2021-2-11 1:22:0
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation fade-in
 * ----------------------------------------
 */
@keyframes fade-in-right {
  0% {
    opacity: 0;
    transform: translateX(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-left {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>