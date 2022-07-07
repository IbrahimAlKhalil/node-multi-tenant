<template>
  <div class="emoji emoji--haha" @click="$emit('handle-click', 'haha')">
    <div class="emoji__face">
      <div class="emoji__eyes"></div>
      <div class="emoji__mouth">
        <div class="emoji__tongue"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'emoji-haha',
});
</script>
<style scoped>
@import url('./common.css');
.emoji--haha .emoji__face {
  -webkit-animation: haha-face 2s linear infinite;
  animation: haha-face 2s linear infinite;
}
.emoji--haha .emoji__eyes {
  width: 26px;
  height: 6px;
  border-radius: 2px;
  left: calc(50% - 13px);
  top: 35px;
  transform: rotate(20deg);
  background: transparent;
  box-shadow: -25px 5px 0 0 #000000, 25px -5px 0 0 #000000;
}
.emoji--haha .emoji__eyes:after {
  left: 0;
  top: 0;
  width: 26px;
  height: 6px;
  border-radius: 2px;
  transform: rotate(-40deg);
  background: transparent;
  box-shadow: -25px -5px 0 0 #000000, 25px 5px 0 0 #000000;
}
.emoji--haha .emoji__mouth {
  width: 80px;
  height: 40px;
  left: calc(50% - 40px);
  top: 50%;
  background: #000000;
  border-radius: 0 0 40px 40px;
  overflow: hidden;
  z-index: 1;
  -webkit-animation: haha-mouth 2s linear infinite;
  animation: haha-mouth 2s linear infinite;
}
.emoji--haha .emoji__tongue {
  width: 70px;
  height: 30px;
  background: #f55064;
  left: calc(50% - 35px);
  bottom: -10px;
  border-radius: 50%;
}

@keyframes haha-face {
  10% {
    transform: translateY(25px);
  }
  20% {
    transform: translateY(15px);
  }
  30% {
    transform: translateY(25px);
  }
  40% {
    transform: translateY(15px);
  }
  50% {
    transform: translateY(25px);
  }
  60% {
    transform: translateY(0);
  }
  70% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(0);
  }
  90% {
    transform: translateY(-10px);
  }
}
@-webkit-keyframes haha-mouth {
  10% {
    transform: scale(0.6);
    top: 45%;
  }
  20% {
    transform: scale(0.8);
    top: 45%;
  }
  30% {
    transform: scale(0.6);
    top: 45%;
  }
  40% {
    transform: scale(0.8);
    top: 45%;
  }
  50% {
    transform: scale(0.6);
    top: 45%;
  }
  60% {
    transform: scale(1);
    top: 50%;
  }
  70% {
    transform: scale(1.2);
    top: 50%;
  }
  80% {
    transform: scale(1);
    top: 50%;
  }
  90% {
    transform: scale(1.1);
    top: 50%;
  }
}
@keyframes haha-mouth {
  10% {
    transform: scale(0.6);
    top: 45%;
  }
  20% {
    transform: scale(0.8);
    top: 45%;
  }
  30% {
    transform: scale(0.6);
    top: 45%;
  }
  40% {
    transform: scale(0.8);
    top: 45%;
  }
  50% {
    transform: scale(0.6);
    top: 45%;
  }
  60% {
    transform: scale(1);
    top: 50%;
  }
  70% {
    transform: scale(1.2);
    top: 50%;
  }
  80% {
    transform: scale(1);
    top: 50%;
  }
  90% {
    transform: scale(1.1);
    top: 50%;
  }
}
</style>
