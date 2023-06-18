import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import QTableView from "./views/QTableView.vue";
import EditProfileView from "./views/EditProfileView.vue";
import ProfileView from "./views/ProfileView.vue";
import AdminPageView from "./views/AdminPageView.vue";
import AdminView from "./views/AdminView.vue";
import LoginView from "./views/LoginPageView.vue";
import LeaderboardView from "./views/LeaderboardView.vue";
import TeamView from "./views/infoViews/TeamView.vue";
import DriverView from "./views/infoViews/DriverView.vue";
import FrontPageView from "./views/FrontPageView.vue";
import TeamListView from "./views/infoViews/TeamListView.vue";
import NewBettingView from "./views/NewBettingView.vue";

import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "FrontPage",
    component: FrontPageView,
    meta: { mustNotBeLoggedIn: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { mustNotBeLoggedIn: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
  },
  {
    path: "/editprofile",
    name: "EditProfilePage",
    component: EditProfileView,
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: LeaderboardView,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPageView,
  },
  {
    path: "/betting",
    name: "Betting",
    component: NewBettingView,
  },
  {
    path: "/qtable",
    name: "qtable",
    component: QTableView,
  },
  {
    path: "/admin2",
    name: "admin2",
    component: AdminView,
  },
  {
    path: "/drivers/:driverUrl",
    name: "driver",
    component: DriverView,
    meta: { mustNotBeLoggedIn: true },
  },
  {
    path: "/teamlist",
    name: "teams",
    component: TeamListView,
    meta: { mustNotBeLoggedIn: true },
  },
  {
    path: "/teams/:teamUrl",
    name: "teampage",
    component: TeamView,
    meta: { mustNotBeLoggedIn: true },
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//https://mokkapps.de/vue-tips/dynamically-change-page-title/

router.beforeEach(async (to, from, next) => {
  const usersStore = await import("./store/usersStore");
  const user = usersStore.useUsersStore().getLoggedUser;
  if (user?.username != null) next();
  else {
    if (to.meta.mustNotBeLoggedIn) next();
    else next("/login");
  }
});

export default router;
