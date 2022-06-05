<template>
  <div class="emoji emoji--wow">
    <div class="emoji__face">
      <div class="emoji__eyebrows"></div>
      <div class="emoji__eyes"></div>
      <div class="emoji__mouth"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'emoji-wow',
});
</script>

<style scoped>
@import url('./common.css');

.emoji--wow:after {
  content: 'Wow';
}
.emoji--wow .emoji__face {
  -webkit-animation: wow-face 3s linear infinite;
  animation: wow-face 3s linear infinite;
}
.emoji--wow .emoji__eyebrows {
  left: calc(50% - 3px);
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: transparent;
  box-shadow: -18px 0 0 0 #000000, -33px 0 0 0 #000000, 18px 0 0 0 #000000,
    33px 0 0 0 #000000;
  -webkit-animation: wow-brow 3s linear infinite;
  animation: wow-brow 3s linear infinite;
}
.emoji--wow .emoji__eyebrows:before,
.emoji--wow .emoji__eyebrows:after {
  width: 24px;
  height: 20px;
  border: 6px solid #000000;
  box-sizing: border-box;
  border-radius: 50%;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  top: -3px;
  left: calc(50% - 12px);
}
.emoji--wow .emoji__eyebrows:before {
  margin-left: -25px;
}
.emoji--wow .emoji__eyebrows:after {
  margin-left: 25px;
}
.emoji--wow .emoji__eyes {
  width: 16px;
  height: 24px;
  left: calc(50% - 8px);
  top: 35px;
  border-radius: 50%;
  background: transparent;
  box-shadow: 25px 0 0 0 #000000, -25px 0 0 0 #000000;
}
.emoji--wow .emoji__mouth {
  width: 30px;
  height: 45px;
  left: calc(50% - 15px);
  top: 50%;
  border-radius: 50%;
  background: #000000;
  -webkit-animation: wow-mouth 3s linear infinite;
  animation: wow-mouth 3s linear infinite;
}

@-webkit-keyframes wow-face {
  15%,
  25% {
    transform: rotate(20deg) translateX(-25px);
  }
  45%,
  65% {
    transform: rotate(-20deg) translateX(25px);
  }
  75%,
  100% {
    transform: rotate(0deg) translateX(0);
  }
}
@keyframes wow-face {
  15%,
  25% {
    transform: rotate(20deg) translateX(-25px);
  }
  45%,
  65% {
    transform: rotate(-20deg) translateX(25px);
  }
  75%,
  100% {
    transform: rotate(0deg) translateX(0);
  }
}
@-webkit-keyframes wow-brow {
  15%,
  65% {
    top: 25px;
  }
  75%,
  100%,
  0% {
    top: 15px;
  }
}
@keyframes wow-brow {
  15%,
  65% {
    top: 25px;
  }
  75%,
  100%,
  0% {
    top: 15px;
  }
}
@-webkit-keyframes wow-mouth {
  10%,
  30% {
    width: 20px;
    height: 20px;
    left: calc(50% - 10px);
  }
  50%,
  70% {
    width: 30px;
    height: 40px;
    left: calc(50% - 15px);
  }
  75%,
  100% {
    height: 50px;
  }
}
@keyframes wow-mouth {
  10%,
  30% {
    width: 20px;
    height: 20px;
    left: calc(50% - 10px);
  }
  50%,
  70% {
    width: 30px;
    height: 40px;
    left: calc(50% - 15px);
  }
  75%,
  100% {
    height: 50px;
  }
}
</style>
