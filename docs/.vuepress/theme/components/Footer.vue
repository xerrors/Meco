<template>
  <div class="footer-container">
    &copy; 2019-2021 ❤️ Yuchuan &ensp;
    <a href="http://www.beian.miit.gov.cn" target="_blank">皖 ICP 备 19016269 号</a>
    <!-- <svg viewBox="0 0 120 28">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 13 -9"
            result="goo"
          />
          <xfeBlend in="SourceGraphic" in2="goo" />
        </filter>
        <path
          id="wave"
          d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z"
        />
      </defs>

      <use id="wave3" class="wave" xlink:href="#wave" x="0" y="-2"></use>
      <use id="wave2" class="wave" xlink:href="#wave" x="0" y="0"></use>

      <g class="gooeff" filter="url(#goo)">
        <use id="wave1" class="wave" xlink:href="#wave" x="0" y="1" />
      </g>
    </svg> -->
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 20px 0;
  width: 100%;
  height: 60px;

  // position: absolute;
  // bottom: 0px;

  margin-top: 20px;

  a {
    color: inherit;
  }
}

// $white: #ffffff;
// $bluegrd: #6f8cff;
// $border: 1px solid #eeeeff;

// * {
//   margin: 0;
//   padding: 0;
// }

// a {
//   color: #fff;
//   text-decoration: none;
// }
// footer {
//   width: 100%;
//   position: fixed;
//   bottom: 0px;
// }

svg {
  width: 100%;
  overflow: visible;
}

.wave {
  animation: wave 4s linear;
  animation-iteration-count: infinite;
  fill: #4478e3;
}

.gooeff {
  filter: url(#goo);
}
#wave2 {
  animation-duration: 5s;
  animation-direction: reverse;
  opacity: 0.6;
}
#wave3 {
  animation-duration: 7s;
  opacity: 0.3;
}

@keyframes wave {
  to {
    transform: translateX(-100%);
  }
}
</style>