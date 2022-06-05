<template>
  <div class="emoji emoji--love">
    <div class="emoji__heart"></div>
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
.emoji--love {
  background: #f55064;
}
.emoji--love:after {
  content: 'Love';
}
.emoji--love .emoji__heart {
  left: calc(50% - 40px);
  top: calc(50% - 40px);
  width: 80px;
  height: 80px;
  -webkit-animation: heart-beat 1s linear infinite alternate;
  animation: heart-beat 1s linear infinite alternate;
}
.emoji--love .emoji__heart:before,
.emoji--love .emoji__heart:after {
  left: calc(50% - 20px);
  top: calc(50% - 32px);
  width: 40px;
  height: 64px;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
}
.emoji--love .emoji__heart:before {
  transform: translate(20px) rotate(-45deg);
  transform-origin: 0 100%;
}
.emoji--love .emoji__heart:after {
  transform: translate(-20px) rotate(45deg);
  transform-origin: 100% 100%;
}
@-webkit-keyframes heart-beat {
  25% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.6);
  }
}

@keyframes heart-beat {
  25% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.6);
  }
}
@-webkit-keyframes haha-face {
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
</style>
