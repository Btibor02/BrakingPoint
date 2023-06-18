<script setup lang="ts">
  import { ref, computed } from "vue";
  import router from "src/router";
  import { useUsersStore } from "./store/usersStore";
  // import { Cookies } from "quasar";

  const leftDrawer = ref<boolean>(true);
  const usersStore = useUsersStore();
  const anyLoggedUser = computed(() => (usersStore.loggedUser ? true : false));

  function toolbarButtonClicked() {
    if (anyLoggedUser.value == false) {
      router.push({ name: "Login" });
    } else {
      router.push({ name: "Profile" });
    }
  }

  function logoutButtonClicked() {
    router.push({ name: "FrontPage" });
    usersStore.logOut();
  }

  const menuItems = ref([
    {
      text: "Kezdőlap",
      name: "FrontPage",
      route: "/",
      disabled: false,
      separator: false,
    },
    {
      text: "Profil",
      name: "profile",
      route: "/profile",
      disabled: false,
      separator: false,
    },
    {
      text: "Profil módosítása",
      name: "editProfile",
      route: "/editprofile",
      disabled: false,
      separator: false,
    },
    {
      text: "Admin",
      name: "admin",
      route: "/admin",
      disabled: false,
      separator: false,
    },
    {
      text: "Ranglista",
      name: "leaderboard",
      route: "/leaderboard",
      disabled: false,
      separator: true,
    },
    {
      text: "Csapatok",
      name: "teamslist",
      route: "/teamlist",
    },
    {
      text: "Fogadás",
      name: "bettingview",
      route: "/betting",
    },
    {
      text: "Fogadás tábla",
      name: "qtable",
      route: "/qtable",
    },
  ]);
</script>

<template>
  <div id="bg-color" elevated style="background: #a71616">
    <q-layout view="hHh Lpr fFf">
      <q-header class="text-white text-center" elevated style="background: #1b1b1b">
        <q-toolbar>
          <q-btn dense flat icon="mdi-menu" round size="15px" @click="leftDrawer = !leftDrawer" />

          <!--Kis menü-->
          <q-toolbar-title id="title" style="cursor: pointer; align-items: center" @click="router.push({ path: '/' })">
            <q-img class="position: relative; text-align: center; q-mr-xl" style="height: 80px; max-width: 350px">
              <img alt="BrakingPointLogo" src="./assets/BrakingPointLogo.png" />
            </q-img>
          </q-toolbar-title>
          <q-btn no-caps size="15px" @click="toolbarButtonClicked">
            {{ usersStore.loggedUser ? usersStore.loggedUser.username : "Bejelentkezés" }}
          </q-btn>
          <label v-if="usersStore.loggedUser">Egyenleg: {{ usersStore.loggedUser.balance }}</label>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawer"
        bordered
        :breakpoint="500"
        class="q-pa-md"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        show-if-above
        :width="200"
      >
        <q-scroll-area class="fit">
          <!-- routes: -->
          <q-list>
            <template v-for="(menuItem, index) in menuItems" :key="index">
              <q-item clickable :disable="menuItem.disabled" :to="menuItem.route">
                <q-item-section>
                  {{ menuItem.text }}
                </q-item-section>
              </q-item>
              <q-separator v-if="menuItem.separator" :key="'sep' + index" />
            </template>
            <q-separator />
          </q-list>
          <br />
          <q-btn v-if="anyLoggedUser" no-caps size="15px" @click="logoutButtonClicked">Kijelentkezés</q-btn>
        </q-scroll-area>
      </q-drawer>

      <q-page-container id="container">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>
    </q-layout>
  </div>

  <footer style="background: #1b1b1b; min-height: 12vh; position: relative; text-align: center">
    <q-img style="height: 80px; max-width: 350px">
      <img alt="BrakingPointLogo" src="./assets/BrakingPointLogoSmall.png" />
    </q-img>
    <p style="color: white">© 2023 BrakingPoint Minden jog fenntartva.</p>
  </footer>
</template>

<style>
  #bg-color {
    /* background-image: linear-gradient(to bottom, v-bind(mainColor1), v-bind(mainColor2)); */
    background-size: cover;
    background-attachment: fixed;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  #title {
    font-size: 10px;
    @media (min-width: 400px) {
      font-size: calc(10px + 0.5vw);
    }
    @media (min-width: 800px) {
      font-size: calc(14px + 0.5vw);
    }
    @media (min-width: 1200px) {
      font-size: calc(18px + 0.5vw);
    }
  }
</style>
