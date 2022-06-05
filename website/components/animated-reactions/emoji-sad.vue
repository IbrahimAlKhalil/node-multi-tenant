<template>
  <div class="emoji emoji--sad">
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
  name: 'emoji-love',
});
</script>
<style scoped>
@import url('./common.css');

/* .emoji--sad:after {
  content: 'Sad';
} */
.emoji--sad .emoji__face {
  -webkit-animation: sad-face var(--animdu) ease-in infinite;
  animation: sad-face var(--animdu) ease-in infinite;
}
.emoji--sad .emoji__eyebrows {
  left: calc(50% - 3px);
  top: 35px;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: transparent;
  box-shadow: -40px 9px 0 0 #000000, -25px 0 0 0 #000000, 25px 0 0 0 #000000,
    40px 9px 0 0 #000000;
}
.emoji--sad .emoji__eyebrows:before,
.emoji--sad .emoji__eyebrows:after {
  width: 30px;
  height: 20px;
  border: 6px solid #000000;
  box-sizing: border-box;
  border-radius: 50%;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  top: 2px;
  left: calc(50% - 15px);
}
.emoji--sad .emoji__eyebrows:before {
  margin-left: -30px;
  transform: rotate(-30deg);
}
.emoji--sad .emoji__eyebrows:after {
  margin-left: 30px;
  transform: rotate(30deg);
}
.emoji--sad .emoji__eyes {
  width: 14px;
  height: 16px;
  left: calc(50% - 7px);
  top: 50px;
  border-radius: 50%;
  background: transparent;
  box-shadow: 25px 0 0 0 #000000, -25px 0 0 0 #000000;
}
.emoji--sad .emoji__eyes:after {
  background: #548dff;
  width: 12px;
  height: 12px;
  margin-left: 6px;
  border-radius: 0 100% 40% 50%/0 50% 40% 100%;
  transform-origin: 0% 0%;
  -webkit-animation: tear-drop var(--animdu) ease-in infinite;
  animation: tear-drop var(--animdu) ease-in infinite;
}
.emoji--sad .emoji__mouth {
  width: 60px;
  height: 80px;
  left: calc(50% - 30px);
  top: 80px;
  box-sizing: border-box;
  border: 6px solid #000000;
  border-radius: 50%;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  background: transparent;
  -webkit-animation: sad-mouth var(--animdu) ease-in infinite;
  animation: sad-mouth var(--animdu) ease-in infinite;
}
.emoji--sad .emoji__mouth:after {
  width: 6px;
  height: 6px;
  background: transparent;
  border-radius: 50%;
  top: 4px;
  left: calc(50% - 3px);
  box-shadow: -18px 0 0 0 #000000, 18px 0 0 0 #000000;
}

.emoji--sad .emoji__face,
.emoji--sad .emoji__eyes:after,
.emoji--sad .emoji__mouth {
  animation-play-state: paused;
}
.emoji--sad:hover .emoji__face,
.emoji--sad:hover .emoji__eyes:after,
.emoji--sad:hover .emoji__mouth {
  --animdu: 2s;
  animation-play-state: running;
}

@-webkit-keyframes sad-face {
  25%,
  35% {
    top: -15px;
  }
  55%,
  95% {
    top: 10px;
  }
  100%,
  0% {
    top: 0;
  }
}
@keyframes sad-face {
  25%,
  35% {
    top: -15px;
  }
  55%,
  95% {
    top: 10px;
  }
  100%,
  0% {
    top: 0;
  }
}
@-webkit-keyframes sad-mouth {
  25%,
  35% {
    transform: scale(0.85);
    top: 70px;
  }
  55%,
  100%,
  0% {
    transform: scale(1);
    top: 80px;
  }
}
@keyframes sad-mouth {
  25%,
  35% {
    transform: scale(0.85);
    top: 70px;
  }
  55%,
  100%,
  0% {
    transform: scale(1);
    top: 80px;
  }
}
@-webkit-keyframes tear-drop {
  0%,
  100% {
    display: block;
    left: 35px;
    top: 15px;
    transform: rotate(45deg) scale(0);
  }
  25% {
    display: block;
    left: 35px;
    transform: rotate(45deg) scale(2);
  }
  49.9% {
    display: block;
    left: 35px;
    top: 65px;
    transform: rotate(45deg) scale(0);
  }
  50% {
    display: block;
    left: -35px;
    top: 15px;
    transform: rotate(45deg) scale(0);
  }
  75% {
    display: block;
    left: -35px;
    transform: rotate(45deg) scale(2);
  }
  99.9% {
    display: block;
    left: -35px;
    top: 65px;
    transform: rotate(45deg) scale(0);
  }
}
@keyframes tear-drop {
  0%,
  100% {
    display: block;
    left: 35px;
    top: 15px;
    transform: rotate(45deg) scale(0);
  }
  25% {
    display: block;
    left: 35px;
    transform: rotate(45deg) scale(2);
  }
  49.9% {
    display: block;
    left: 35px;
    top: 65px;
    transform: rotate(45deg) scale(0);
  }
  50% {
    display: block;
    left: -35px;
    top: 15px;
    transform: rotate(45deg) scale(0);
  }
  75% {
    display: block;
    left: -35px;
    transform: rotate(45deg) scale(2);
  }
  99.9% {
    display: block;
    left: -35px;
    top: 65px;
    transform: rotate(45deg) scale(0);
  }
}
</style>
