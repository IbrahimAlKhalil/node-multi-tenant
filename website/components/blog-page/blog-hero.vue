<template>
  <div class="blog-hero min-h-[80vh]">
    <div class="container flex justify-center items-center p-5 h-full">
      <div class="backdrop w-full h-full p-5 rounded-xl text-white h-full">
        <h1 class="font-bold text-7xl text-center uppercase mb-5">Blog</h1>
        <h2 class="font-bold text-3xl text-center">Your Query Search Here</h2>
        <div class="search-box my-2">
          <input
            type="text"
            v-model="search"
            placeholder="Search Here..."
            @keyup.enter="searchBlog"
            class="block w-1/2 mx-auto rounded-lg p-3 text-xl outline-0 border-2 border-transparent focus:border-secondary"
          />
        </div>
        <div class="featured-blogs">
          <div class="intro">
            <h3>Most Popular</h3>
          </div>
          <div class="bolgs">
            <article class="blog">
              <div class="media">
                <img src="" alt="" />
              </div>
              <div class="content">
                <h3>Feature Blog 1</h3>
                <p>Date: 22-04-2022</p>
                <p class="description">
                  In publishing and graphic design, Lorem ipsum is a placeholder
                  text commonly used to demonstrate the visual form of a
                  document or a typeface without In publishing and graphic
                  design, Lorem ipsum is a placeholder text commonly used to
                  demonstrate the visual form of a document or a typeface
                  without
                </p>
                <a href="#">Read More</a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'blog-hero',
});
</script>

<style scoped>
.backdrop {
  background-color: rgba(9, 8, 8, 0.75);
  background-blend-mode: multiply;
}
.blog-hero {
  background-size: cover;
  background: url('assets/images/HeroBackground.svg') no-repeat center center;
}
</style>
