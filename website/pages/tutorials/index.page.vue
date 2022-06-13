<template>
  <TutorialPage>
    <template #left-sidebar>
      <h1
        class="font-bold text-xl text-center text-primary border-b border-b-gray-300 py-5 uppercase"
      >
        Software Tutorial
      </h1>
      <the-list>
        <list-item
          v-for="item of tutorialCategories"
          :key="item.slug"
          :data="item"
        ></list-item>
      </the-list>
    </template>

    <template #right-sidebar>
      <right-section-container>
        <right-item title="Right Sidebar" slug="test" :isActive="true" />
        <right-item title="Right Sidebar" slug="test" />
      </right-section-container>
    </template>

    <div class="main-area h-full flex flex-col justify-between">
      <div class="content w-11/12 mx-auto flex">
        <div class="grow pt-10" style="flex: 2">
          <section class="intro-meta pb-8 border-b border-b-gray-200">
            {{ tutorials }}
            <h3 class="font-bold text-5xl mb-3">Students Administration</h3>
            <p class="text-gray-500 mb-5">
              <span>Last update at: </span> <span>28-05-2022</span>
            </p>
            <p class="text-justify">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere,
              fuga illum molestiae delectus hic repudiandae nobis distinctio
              beatae, esse non nam facilis qui, et ullam.
            </p>
          </section>
          <section class="my-10">
            <h3 class="font-bold text-3xl mb-3">Students Administration</h3>
            <p class="text-gray-500 dark:text-inherit mb-5">
              <span>Last update at: </span> <span>28-05-2022</span>
            </p>
            <p class="text-justify mb-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              fugit soluta placeat facilis, maxime aliquid omnis, corporis
              itaque temporibus fugiat aperiam obcaecati sed enim. Ratione
              blanditiis sed voluptas iste magni officiis officia commodi
              delectus quisquam libero eveniet adipisci maiores suscipit
              tenetur, quis dicta odit ipsum ipsam nihil voluptatum. Obcaecati,
              molestias!
            </p>
            <p class="text-justify mb-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              fugit soluta placeat facilis, maxime aliquid omnis, corporis
              itaque temporibus fugiat aperiam obcaecati sed enim. Ratione
              blanditiis sed voluptas iste magni officiis officia commodi
              delectus quisquam libero eveniet adipisci maiores suscipit
              tenetur, quis dicta odit ipsum ipsam nihil voluptatum. Obcaecati,
              molestias!
            </p>
          </section>
          <section class="my-10">
            <h3 class="font-bold text-3xl mb-3">Students Administration</h3>
            <p class="text-gray-500 dark:text-inherit mb-5">
              <span>Last update at: </span> <span>28-05-2022</span>
            </p>
            <p class="text-justify mb-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              fugit soluta placeat facilis, maxime aliquid omnis, corporis
              itaque temporibus fugiat aperiam obcaecati sed enim. Ratione
              blanditiis sed voluptas iste magni officiis officia commodi
              delectus quisquam libero eveniet adipisci maiores suscipit
              tenetur, quis dicta odit ipsum ipsam nihil voluptatum. Obcaecati,
              molestias!
            </p>
            <p class="text-justify mb-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              fugit soluta placeat facilis, maxime aliquid omnis, corporis
              itaque temporibus fugiat aperiam obcaecati sed enim. Ratione
              blanditiis sed voluptas iste magni officiis officia commodi
              delectus quisquam libero eveniet adipisci maiores suscipit
              tenetur, quis dicta odit ipsum ipsam nihil voluptatum. Obcaecati,
              molestias!
            </p>
          </section>
        </div>
      </div>
      <footer class="py-5 border-t border-t-gray-300">
        <div class="w-11/12 mx-auto flex justify-between items-center">
          <a href="#" class="flex items-center gap-3 font-bold">
            <component :is="ArrowLeft" style="bottom: 0"></component>
            <span>Previous</span>
          </a>
          <a href="#" class="flex items-center gap-3 font-bold">
            <span>Next</span>
            <component :is="ArrowRight" style="bottom: 0"></component>
          </a>
        </div>
      </footer>
    </div>
  </TutorialPage>
</template>

<script lang="ts">
import TutorialPage from '#layouts/tutorial-page.vue';
import { ListItem } from '#components/ui/list';
import {
  RightSectionContainer,
  RightItem,
} from '#components/tutorials-page/right-section';
import ArrowLeft from '#icons/solid/arrow-left.svg';
import ArrowRight from '#icons/solid/arrow-right.svg';
import { TheList } from '#components/ui/list';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tutorial-page',
  components: {
    'right-item': RightItem,
    RightSectionContainer,
    TutorialPage,
    ListItem,
    TheList,
  },
  props: ['tutorialCategories', 'tutorials'],
  data() {
    return {
      leftNavigation: [
        {
          type: 'category',
          title: 'Students Administration',
          slug: 'students-administration',
          subCategories: [
            {
              title: 'Pre Requirements',
              slug: 'pre-requirements',
              subCategories: [
                { title: 'Information', slug: 'information' },
                { title: 'Photo', slug: 'photo' },
                { title: 'Documents', slug: 'admission' },
              ],
            },
            {
              title: 'Registration',
              slug: 'registration',
            },
          ],
        },
        {
          type: 'category',
          title: 'Accounts',
          slug: 'accounts',
          subCategories: [
            {
              title: 'Admission',
              slug: 'admission',
              subCategories: [
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
              ],
            },
          ],
        },
        {
          type: 'category',
          title: 'Students Administration',
          slug: 'students-administration',
          subCategories: [
            {
              title: 'Pre Requirements',
              slug: 'pre-requirements',
              subCategories: [
                { title: 'Information', slug: 'information' },
                { title: 'Photo', slug: 'photo' },
                { title: 'Documents', slug: 'admission' },
              ],
            },
            {
              title: 'Registration',
              slug: 'registration',
            },
          ],
        },
        {
          type: 'category',
          title: 'Accounts',
          slug: 'accounts',
          subCategories: [
            {
              title: 'Admission',
              slug: 'admission',
              subCategories: [
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
                { title: 'Admission', slug: 'admission' },
              ],
            },
          ],
        },
      ],
    };
  },
  setup() {
    return {
      ArrowLeft,
      ArrowRight,
    };
  },
});
</script>
