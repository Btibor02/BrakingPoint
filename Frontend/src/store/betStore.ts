import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
  progress: true,
});
export interface IBet {
  id?: number;
  title?: string;
  date?: string;
  category?: string;
  odds?: number;
  odds2?: number;
  status?: string;
  sportID?: number;
}
let userId: number;
interface IPagination {
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
  sortBy: string;
  descending: boolean;
}
interface IState {
  bets: Array<IBet>;
  data: IBet; // temporary object for create, edit and delete method
  dataOld: IBet; // temporary object for patch method (store data here before edit)
  isLoading: boolean;
  selected: Array<IBet>;
  pagination: IPagination;
  filter: string;
  betAmount: number;
  win: boolean;
  title: string;
  raceDate: string;
  winner: string;
}
export const useBetStore = defineStore({
  id: "betStore",
  state: (): IState => ({
    bets: [],
    data: {},
    dataOld: {},
    isLoading: false,
    selected: [],
    filter: "",
    pagination: {
      sortBy: "id",
      descending: false,
      page: 0,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    betAmount: 0,
    win: false,
    title: "",
    raceDate: "",
    winner: "",
  }),
  getters: {
    
    // example getter, not in use
    getPosts(): Array<IBet> {
      return this.bets;
    },
  },
  actions: {
    async getBetById(): Promise<void> {
      if (this.data && this.data.id) {
        Loading.show();
        $axios
          .get(`http://localhost:8000/api/bets/${this.data.id}`)
          .then((res) => {
            Loading.hide();
            if (res && res.data) {
              this.data = res.data;
              Object.assign(this.dataOld, this.data); // for compare after submit
            }
          })
          .catch((error) => {
            Loading.hide();
            Notify.create({
              message: `Error while get post by id: ${error.response.data.message}`,
              color: "negative",
            });
          });
      }
    },
    async editBetById(): Promise<void> {
      if (this.data && this.data.id) {
        const diff: any = {}; // only the changed fields are included
        Object.keys(this.data).forEach((k, i) => {
          const newValue = Object.values(this.data)[i];
          const oldValue = Object.values(this.dataOld)[i];
          if (newValue != oldValue) diff[k] = newValue;
        });

        if (Object.keys(diff).length == 0) {
          Notify.create({
            message: "Nothing changed!",
            color: "negative",
          });
          this.isLoading = false;
        } else {
          Loading.show();
          this.isLoading = true;
          $axios
            .patch(`http://localhost:8000/api/bets/${this.data.id}`, diff)
            .then((res) => {
              Loading.hide();
              if (res && res.data) {
                this.isLoading = false;
                this.selected[0] = res.data;
                Notify.create({
                  message: `Bet with id=${res.data.id} has been edited successfully!`,
                  color: "positive",
                });
              }
            })
            .catch((error) => {
              Loading.hide();
              Notify.create({
                message: `Error (${error.response.data.status}) while edit by id: ${error.response.data.message}`,
                color: "negative",
              });
            });
        }
      }
    },
    async endBet(): Promise<void> {
      let sendStatus = "";
      console.log(this.win);
      if (this.win == true) {
        if (this.data.category == "versus") {
          if (this.winner == "First") {
            sendStatus = "winFirst";
          } else if (this.winner == "Second") {
            sendStatus = "winSecond";
          }
        } else {
          sendStatus = "win";
        }
      }
      if (this.win == false) {
        sendStatus = "lose";
      }
      $axios
        .patch(`http://localhost:8000/api/bets/${this.data.id}`, {
          status: sendStatus,
        })
        .then((res) => {
          Notify.create({
            message: `Bet with id=${res.data.id} has been edited successfully!`,
            color: "positive",
          });
        })
        .catch((error) => {
          Notify.create({
            message: `Error in create bet: ${error.response.data.message}`,
            color: "negative",
          });
        })
        .finally(() => {
          this.fetchBets();
        });
    },
    async createNewBet(): Promise<void> {
      Loading.show();
      this.isLoading = true;

      $axios
        .post("http://localhost:8000/api/bets", {
          title: this.data.title,
          id: this.data.id,
          date: this.data.date,
          category: this.data.category,
          odds: this.data.odds,
          odds2: this.data.odds2,
          status: "ongoing",
          sportID: 1,
        })
        .then((res) => {
          Notify.create({
            message: `Bet with id=${res.data.id} has been created successfully!`,
            color: "positive",
          });
        })
        .catch((error) => {
          Notify.create({
            message: `Error in create bet: ${error.response.data.message}`,
            color: "negative",
          });
        })
        .finally(() => {
          this.fetchBets();
        });
    },
    async createNewTicket(): Promise<void> {
      Loading.show();
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-CA");
      this.isLoading = true;
      $axios
        .post("http://localhost:8000/api/tickets", {
          status: "ongoing",
          date: this.data.date,
          debt: this.betAmount,
          sum_odds: this.data.odds,
          races: this.data.category,
          payment_date: formattedDate,
          betID: this.data.id,
          userID: userId,
        })
        .then((res) => {
          Notify.create({
            message: `Bet with id=${res.data.ticketID} has been created successfully!`,
            color: "positive",
          });
        })
        .catch((error) => {
          Notify.create({
            message: `Error in create bet: ${error.response.data.message}`,
            color: "negative",
          });
        })
        .finally(() => {
          this.fetchBets();
          this.betAmount = 0;
        });
    },

    async deleteById(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      if (this.selected.length) {
        const id_for_delete = this.selected.pop()?.id;
        await $axios
          .delete(`http://localhost:8000/api/bets/${id_for_delete}`)
          .then(() => {
            Loading.hide();
            Notify.create({
              message: `Document with id=${id_for_delete} has been deleted successfully!`,
              color: "positive",
            });
            if (this.selected.length) this.deleteById(); // recursive call
            else this.isLoading = false;
          })
          .catch((error) => {
            Loading.hide();
            Notify.create({
              message: `Error (${error.response.data.status}) while delete by id: ${error.response.data.message}`,
              color: "negative",
            });
          });
      }
    },

    async fetchBets(): Promise<void> {
      Loading.show();

      $axios
        .get("http://localhost:8000/api/bets")
        .then((response) => {
          this.bets = response.data;
          Loading.hide();
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    
  },
  
});
