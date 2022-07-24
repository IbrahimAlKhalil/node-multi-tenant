<template>
  <header
    class="fixed top-0 w-full z-[99999] transition duration-300 ease-in-out b"
    :class="{ 'bg-white dark:bg-black shadow-md': isSticky }"
    style="height: var(--header-height)"
  >
    <div
      class="flex justify-between items-center container mx-auto py-3 h-full"
    >
      <div class="logo h-full z-[1]">
        <router-link to="/" class="block h-full">
          <img class="h-full" :alt="t('common.app-title')" :src="Logo" />
        </router-link>
      </div>

      <nav
        class="nav flex-grow lg:block"
        :class="{
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center bg-black/90 text-white':
            activeMenu,
          hidden: !activeMenu,
        }"
      >
        <ul class="flex flex-col md:flex-row items-center justify-center">
          <li v-for="item in navData.data" :key="item.href">
            <router-link
              class="ml-2 p-2 rounded-sm font-bold text-md transition-all duration-150"
              v-slot="{ route }"
              v-if="!item.ssr"
              :to="item.href"
            >
              <span
                class="m-0 py-2 md:p-0 group hover:text-primary text-2xl md:text-base"
                :class="{
                  'dark:text-light dark:hover:text-secondary': isSticky,
                  'text-primary':
                    activeRoute.fullPath === route.fullPath && !isSticky,
                  'dark:text-secondary text-primary':
                    activeRoute.fullPath === route.fullPath && isSticky,
                  'text-white md:text-text': !(
                    activeRoute.fullPath === route.fullPath
                  ),
                }"
              >
                <component
                  class="mr-1 text-inherit group-hover:scale-110 transition-scale duration-300 hidden xl:inline-block"
                  :class="{
                    'scale-125': activeRoute.fullPath === route.fullPath,
                  }"
                  :is="item.icon"
                />

                {{ t(item.text) }}
              </span>
            </router-link>
            <a
              class="ml-2 p-2 rounded-sm font-bold text-md transition-all duration-150"
              :href="item.href"
              v-else
            >
              <span
                class="m-0 py-2 md:p-0 group hover:text-primary text-2xl md:text-base"
                :class="{
                  'dark:text-light dark:hover:text-secondary': isSticky,
                  'text-primary':
                    activeRoute.fullPath === item.href && !isSticky,
                  'dark:text-secondary text-primary':
                    activeRoute.fullPath === item.href && isSticky,
                  'text-white md:text-text': !(
                    activeRoute.fullPath === item.href
                  ),
                }"
              >
                <component
                  class="mr-1 text-inherit group-hover:scale-110 transition-scale duration-300 hidden xl:inline-block"
                  :class="{
                    'scale-125': activeRoute.fullPath === item.href,
                  }"
                  :is="item.icon"
                />

                {{ t(item.text) }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="action-area z-[1]">
        <div
          class="lg:hidden rounded-md p-2 border flex justify-center items-center group transition duration-150"
          :class="{
            'border-primary hover:bg-primary': !activeMenu,
            'bg-secondary border-secondary hover:border-secondary': activeMenu,
          }"
          @click="activeMenu = !activeMenu"
        >
          <MenuBar
            class="transition duration-150 group-hover:text-white text-2xl md:text-4xl"
            :class="{ 'text-primary': !activeMenu, 'text-white': activeMenu }"
            style="bottom: 0"
            v-show="!activeMenu"
          />
          <Cross
            class="transition duration-150 group-hover:text-white text-2xl md:text-4xl"
            :class="{ 'text-primary': !activeMenu, 'text-white': activeMenu }"
            style="bottom: 0"
            v-show="activeMenu"
          />
        </div>
        <router-link to="/login" v-if="!isLoggedIn">
          <primary-btn
            :title="t('common.login')"
            class="hidden lg:block"
            :icon="DoorOpen"
          />
        </router-link>
        <a href="/app" v-else>
          <primary-btn
            :title="t('common.go-to-dashboard')"
            class="hidden lg:block"
            :icon="TableColumns"
          />
        </a>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import TableColumns from '#icons/duotone/columns.svg';
import DoorOpen from '#icons/duotone/door-open.svg';
import { useNavData } from '#stores/navdata.store';
import { computed, defineComponent } from 'vue';
import { useAuth } from '#stores/auth.store';
import MenuBar from '#icons/light/bars.svg';
import Cross from '#icons/light/times.svg';
import Logo from '#images/logo.svg?url';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'the-header',
  props: ['defaultSticky'],
  components: {
    PrimaryBtn,
    MenuBar,
    Cross,
  },
  data() {
    return {
      isDefaultSticky: false,
      activeMenu: false,
      headerHeight: 70,
      isSticky: false,
    };
  },
  mounted() {
    this.isDefaultSticky = this.defaultSticky;
    if (this.isDefaultSticky) {
      this.isSticky = true;
    } else {
      window.addEventListener('scroll', () =>
        this.updateScroll(window.scrollY),
      );
      this.isSticky = window.scrollY !== 0;
    }
  },
  unmounted() {
    window.removeEventListener('scroll', () =>
      this.updateScroll(window.scrollY),
    );
  },
  methods: {
    updateScroll(value: number) {
      if (value > this.headerHeight) {
        this.isSticky = true;
      }
      if (value < this.headerHeight) {
        this.isSticky = false;
      }
    },
  },
  setup() {
    const activeRoute = useRoute();
    const navData = useNavData();
    const auth = useAuth();
    const i18n = useI18n();

    const isLoggedIn = computed(() => !!auth.user);

    return {
      TableColumns,
      activeRoute,
      isLoggedIn,
      t: i18n.t,
      DoorOpen,
      navData,
      MenuBar,
      Cross,
      Logo,
    };
  },
});
</script>
