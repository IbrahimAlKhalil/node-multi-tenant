<template>
  <div class="emoji emoji--angry">
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
  name: 'emoji-angry',
});
</script>

<style scoped>
@import url('./common.css');

.emoji--angry {
  background: linear-gradient(#d5234c -10%, #ffda6a);
  background-size: 100%;
  -webkit-animation: angry-color var(--animdu) ease-in infinite;
  animation: angry-color var(--animdu) ease-in infinite;
}
/* .emoji--angry:after {
  content: 'Angry';
} */
.emoji--angry .emoji__face {
  -webkit-animation: angry-face var(--animdu) ease-in infinite;
  animation: angry-face var(--animdu) ease-in infinite;
}
.emoji--angry .emoji__eyebrows {
  left: calc(50% - 3px);
  top: 55px;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: transparent;
  box-shadow: -44px 5px 0 0 #000000, -7px 16px 0 0 #000000, 7px 16px 0 0 #000000,
    44px 5px 0 0 #000000;
}
.emoji--angry .emoji__eyebrows:before,
.emoji--angry .emoji__eyebrows:after {
  width: 50px;
  height: 20px;
  border: 6px solid #000000;
  box-sizing: border-box;
  border-radius: 50%;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  top: 0;
  left: calc(50% - 25px);
}
.emoji--angry .emoji__eyebrows:before {
  margin-left: -25px;
  transform: rotate(15deg);
}
.emoji--angry .emoji__eyebrows:after {
  margin-left: 25px;
  transform: rotate(-15deg);
}
.emoji--angry .emoji__eyes {
  width: 12px;
  height: 12px;
  left: calc(50% - 6px);
  top: 70px;
  border-radius: 50%;
  background: transparent;
  box-shadow: 25px 0 0 0 #000000, -25px 0 0 0 #000000;
}
.emoji--angry .emoji__mouth {
  width: 36px;
  height: 18px;
  left: calc(50% - 18px);
  bottom: 15px;
  background: #000000;
  border-radius: 50%;
  -webkit-animation: angry-mouth var(--animdu) ease-in infinite;
  animation: angry-mouth var(--animdu) ease-in infinite;
}
.emoji--angry,
.emoji--angry .emoji__face,
.emoji--angry .emoji__mouth {
  animation-play-state: paused;
}
.emoji--angry:hover,
.emoji--angry:hover .emoji__face,
.emoji--angry:hover .emoji__mouth {
  --animdu: 2s;
  animation-play-state: running;
}

@-webkit-keyframes angry-color {
  45%,
  60% {
    background-size: 250%;
  }
  85%,
  100%,
  0% {
    background-size: 100%;
  }
}
@keyframes angry-color {
  45%,
  60% {
    background-size: 250%;
  }
  85%,
  100%,
  0% {
    background-size: 100%;
  }
}
@-webkit-keyframes angry-face {
  35%,
  60% {
    transform: translateX(0) translateY(10px) scale(0.9);
  }
  40% {
    transform: translateX(-5px) translateY(10px) scale(0.9);
  }
  45% {
    transform: translateX(5px) translateY(10px) scale(0.9);
  }
  50% {
    transform: translateX(-5px) translateY(10px) scale(0.9);
  }
  55% {
    transform: translateX(5px) translateY(10px) scale(0.9);
  }
}
@keyframes angry-face {
  35%,
  60% {
    transform: translateX(0) translateY(10px) scale(0.9);
  }
  40% {
    transform: translateX(-5px) translateY(10px) scale(0.9);
  }
  45% {
    transform: translateX(5px) translateY(10px) scale(0.9);
  }
  50% {
    transform: translateX(-5px) translateY(10px) scale(0.9);
  }
  55% {
    transform: translateX(5px) translateY(10px) scale(0.9);
  }
}

@-webkit-keyframes angry-mouth {
  25%,
  50% {
    height: 6px;
    bottom: 25px;
  }
}
@keyframes angry-mouth {
  25%,
  50% {
    height: 6px;
    bottom: 25px;
  }
}
</style>
