import server from "./axios.instance";
import { defineStore } from "pinia";
import { Loading } from "quasar";

interface IAllUser {
  userID?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  level?: number;
  balance?: number;
  picture_frame?: string;
  profile_picture?: string;
}

interface IState {
  users: Array<IAllUser>;
}

export const useAllUserStore = defineStore({
  id: "users",
  state: (): IState => ({
    users: [],
  }),
  getters: {
    async getAllUser(): Promise<IAllUser[] | null> {
      Loading.show();
      await server
        .get("api/leaderboard")
        .then((res) => {
          if (res && res.data) {
            this.users = res.data;
          }
          console.log(this.users);
          Loading.hide();
        })
        .catch((error) => {
          Loading.hide();
          console.log(error.response);
        });
      return this.users;
    },
  },
  actions: {},
});
