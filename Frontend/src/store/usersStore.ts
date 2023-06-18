/* eslint-disable @typescript-eslint/no-non-null-assertion */
import server from "./axios.instance";
import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import router from "src/router";

interface IUser {
  userID?: number;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  last_name?: string;
  first_name?: string;
  balance?: number;
  preferred_category?: string;
  level?: number;
  picture_frame?: string;
  rank?: number;
  profile_picture?: string;
  xp?: number;
  admin?: number;
  email_verified_at?: Date;
  colour_palette?: string;
}

interface IState {
  loggedUser: null | IUser;
}

export const useUsersStore = defineStore("user", {
  state: (): IState => ({
    loggedUser: null,
  }),
  getters: {
    getLoggedUser(): null | IUser {
      if (this.loggedUser == null) {
        server.get("api/user").then((res) => {
          this.loggedUser = res.data;
          console.log(this.loggedUser);
        });
        return this.loggedUser;
      } else {
        console.log(this.loggedUser);
        localStorage.setItem("id", this.loggedUser.userID!.toString());
        return this.loggedUser;
      }
    },
  },
  actions: {
    async getSanctumCookie() {
      try {
        await server.get("sanctum/csrf-cookie");
      } catch (error) {
        if (error) throw error;
      }
    },

    async login(params: IUser): Promise<void> {
      {
        await server
          .post("login", {
            email: params.email,
            password: params.password,
          })
          .then(() => {
            server
              .get("api/user")
              .then((res) => {
                this.loggedUser = res.data;
                console.log(this.loggedUser);
                return this.loggedUser;
              })
              .then(() => {
                Notify.create({
                  message: `Sikeres bejelentkezés!`,
                  color: "positive",
                });
                router.push({ name: "FrontPage" });
              });
          })
          .catch((error) => {
            this.loggedUser = null;
            Loading.hide();
            Notify.create({
              message: `Sikertelen bejelentkezés: ${error.response.data.message}`,
              color: "negative",
            });
          });
      }
    },

    async logOut(): Promise<void> {
      Loading.show();
      await server
        .post("logout")
        .then(() => {
          this.loggedUser = null;
          Loading.hide();
        })
        .catch(() => {
          this.loggedUser = null;
          Loading.hide();
        });
    },

    async register(params: IUser) {
      await server
        .post("register", {
          username: params.username,
          email: params.email,
          password: params.password,
          password_confirmation: params.confirmPassword,
        })
        .then(() => {
          server
            .get("api/user")
            .then((res) => {
              this.loggedUser = res.data;
              console.log(this.loggedUser);
              return this.loggedUser;
            })
            .then(() => {
              Notify.create({
                message: `Sikeres regisztráció!`,
                color: "positive",
              });
              router.push({ name: "FrontPage" });
            });
        })
        .catch((error) => {
          console.log(error.response);
          Notify.create({
            message: `Sikertelen regisztráció: ${error.response.data.message}`,
            color: "negative",
          });
        });
    },

    async googleAuth(params: IUser) {
      await server
        .post("register", {
          username: params.username,
          email: params.email,
          password: params.password,
          password_confirmation: params.confirmPassword,
        })
        .then(() => {
          server
            .get("api/user")
            .then((res) => {
              this.loggedUser = res.data;
              console.log(this.loggedUser);
              return this.loggedUser;
            })
            .then(() => {
              Notify.create({
                message: `Sikeres regisztráció!`,
                color: "positive",
              });
              router.push({ name: "FrontPage" });
            });
        })
        .catch(() => {
          server
            .post("login", {
              email: params.email,
              password: params.password,
            })
            .then(() => {
              server
                .get("api/user")
                .then((res) => {
                  this.loggedUser = res.data;
                  console.log(this.loggedUser, params.profile_picture);
                  return this.loggedUser;
                })
                .then(() => {
                  Notify.create({
                    message: `Sikeres bejelentkezés!`,
                    color: "positive",
                  });
                  router.push({ name: "FrontPage" });
                });
            })
            .catch((error) => {
              this.loggedUser = null;
              Loading.hide();
              Notify.create({
                message: `Sikertelen bejelentkezés: ${error.response.data.message}`,
                color: "negative",
              });
            });
        });
    },

    async editProfile(params: IUser) {
      await server
        .put("api/editprofile/" + this.loggedUser?.userID, {
          username: params.username,
          email: params.email,
          last_name: params.last_name,
          first_name: params.first_name,
          preferred_category: params.preferred_category,
          profile_picture: params.profile_picture,
          colour_palette: params.colour_palette,
        })
        .then(() => {
          server
            .get("api/user")
            .then((res) => {
              this.loggedUser = res.data;
              console.log(res);
              return this.loggedUser;
            })
            .then(() => {
              router.push({ name: "Profile" });
            });
        })
        .catch((error) => {
          console.log(error.response);
          Notify.create({
            message: `Profil szerkesztése sikertelen: ${error.response.data.message}`,
            color: "negative",
          });
        });
    },

    async editPassword(params: IUser) {
      await server
        .put("api/editpassword/" + this.loggedUser?.userID, {
          password: params.password,
        })
        .then(() => {
          server
            .get("api/user")
            .then((res) => {
              this.loggedUser = res.data;
              console.log(res);
              return this.loggedUser;
            })
            .then(() => {
              router.push({ name: "Profile" });
            });
        })
        .catch((error) => {
          console.log(error.response);
          Notify.create({
            message: `Profil szerkesztése sikertelen: ${error.response.data.message}`,
            color: "negative",
          });
        });
    },

    async facebookLogin() {
      await server.get("auth/facebook").then((res) => {
        console.log("Response", res.data);
        window.location.href = res.data;
      });
    },

    async resendVerificationEmail() {
      await server.post("email/verification-notification");
    },
  },
});
