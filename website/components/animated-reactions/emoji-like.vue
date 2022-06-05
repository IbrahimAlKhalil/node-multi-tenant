<template>
  <div class="emoji emoji--like">
    <div class="emoji__hand">
      <div class="emoji__thumb"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'emoji-like',
});
</script>

<style scoped>
@import url('./common.css');
.emoji--like {
  background: #548dff;
}
.emoji--like:after {
  content: 'Like';
}
.emoji--like .emoji__hand {
  left: 25px;
  bottom: 30px;
  width: 20px;
  height: 40px;
  background: #ffffff;
  border-radius: 5px;
  z-index: 0;
  -webkit-animation: hands-up 2s linear infinite;
  animation: hands-up 2s linear infinite;
}
.emoji--like .emoji__hand:before {
  left: 25px;
  bottom: 5px;
  width: 40px;
  background: inherit;
  height: 10px;
  border-radius: 2px 10px 10px 2px;
  box-shadow: 1px -9px 0 1px #ffffff, 2px -19px 0 2px #ffffff,
    3px -29px 0 3px #ffffff;
}
.emoji--like .emoji__thumb {
  border-bottom: 20px solid #ffffff;
  border-left: 20px solid transparent;
  top: -25px;
  right: -25px;
  z-index: 2;
  transform: rotate(5deg);
  transform-origin: 0% 100%;
  -webkit-animation: thumbs-up 2s linear infinite;
  animation: thumbs-up 2s linear infinite;
}
.emoji--like .emoji__thumb:before {
  border-radius: 50% 50% 0 0;
  background: #ffffff;
  width: 10px;
  height: 12px;
  left: -10px;
  top: -8px;
  transform: rotate(-15deg);
  transform-origin: 100% 100%;
  box-shadow: -1px 4px 0 -1px #ffffff;
}

@-webkit-keyframes hands-up {
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(-15deg) translateY(-10px);
  }
  75%,
  100% {
    transform: rotate(0deg);
  }
}
@keyframes hands-up {
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(-15deg) translateY(-10px);
  }
  75%,
  100% {
    transform: rotate(0deg);
  }
}
@-webkit-keyframes thumbs-up {
  25% {
    transform: rotate(20deg);
  }
  50%,
  100% {
    transform: rotate(5deg);
  }
}
@keyframes thumbs-up {
  25% {
    transform: rotate(20deg);
  }
  50%,
  100% {
    transform: rotate(5deg);
  }
}
</style>
