<template>
  <section class="about-us-section relative">
    <div class="container">
      <div class="info">
        <h2>About Us</h2>
      </div>
    </div>
    <div id="video-container">
      <iframe
        src="https://www.youtube.com/embed/07d2dXHYb94?controls=0&autoplay=1&mute=1"
      ></iframe>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style>
.about-us-section {
  min-height: 80vh;
  background: lightblue;
}
#video-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
#video-container iframe {
  width: 100%;
  height: 100%;
}
</style>
