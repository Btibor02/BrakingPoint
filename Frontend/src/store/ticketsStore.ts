import { Notify } from "quasar";
import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { IBet } from "./betStore";
const drivers: string[] = [
  "Alexander Albon",
  "Fernando Alonso",
  "Valtteri Bottas",
  "Nyck de Vries",
  "Pierre Gasly",
  "Lewis Hamilton",
  "Nico Hülkenberg",
  "Charles Leclerc",
  "Kevin Magnussen",
  "Lando Norris",
  "Esteban Ocon",
  "Sergio Pérez",
  "Oscar Piastri",
  "George Russell",
  "Carlos Sainz",
  "Logan Sargeant",
  "Lance Stroll",
  "Yuki Tsunoda",
  "Max Verstappen",
  "Guanyu Zhou",
];
Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
  progress: true,
});
interface ITicket {
  ticketID?: number;
  status?: string;
  debt?: number;
  odds?: number;
  category?: string;
  userID?: number;
  betID?: number;
}
interface IState {
  showGenerateDialog: boolean;
  data: Array<ITicket>;
  filteredData: Array<IBet>;
  filterValue: string;
  fieldNames: string[];
  showTable: boolean;
  showBetDialog: boolean;
  ticketBetAmount: number;
  userId: number;
  picked: string;
  category: string;
  item: Array<ITicket>;
  selectedItem: Array<IBet>;
}

export const useTicketsStore = defineStore({
  id: "ticketStore",
  state: (): IState => ({
    showGenerateDialog: false,
    data: [],
    selectedItem: [],
    filteredData: [],
    filterValue: "",
    fieldNames: [],
    showTable: false,
    showBetDialog: false,
    ticketBetAmount: 0,
    userId: 0,
    picked: "",
    category: "",
    item: [],
  }),
  persist: {
    enabled: true,
  },

  actions: {
    async filterData(category: string) {
      this.filteredData = this.data.filter((item) => item.category === category);
      this.showTable = true;
      console.log(this.data);
    },
    async openBetDialog(item: Array<IBet>) {
      this.showBetDialog = true;
      this.selectedItem = item;
    },
    async closeBetDialog() {
      this.showBetDialog = false;
      this.selectedItem = [];
      this.ticketBetAmount = 0;
      this.picked = "";
    },
    async sendTicket() {
      let sendOdds = this.selectedItem.odds;
      if (this.selectedItem.category == "versus") {
        if (this.picked == "first") {
          sendOdds = this.selectedItem.odds;
        } else {
          sendOdds = this.selectedItem.odds2;
        }
      }
      $axios
        .post(`http://localhost:8000/api/tickets`, {
          status: "ongoing",
          debt: this.ticketBetAmount,
          odds: sendOdds,
          races: this.selectedItem.category,

          userID: localStorage.getItem("id"),
          betID: this.selectedItem.id,
        })
        .then((response) => {
          Notify.create({
            message: `Bet with id=${response.data.ticketID} has been created successfully!`,
            color: "positive",
          });
          this.closeBetDialog();
        })
        .catch((error) => {
          if (error.response.data.message.includes("Insufficient balance")) {
            Notify.create({
              message: `Insufficient balance`,
              color: "negative",
            });
          } else {
            Notify.create({
              message: `Error in create bet: ${error.response.data.message}`,
              color: "negative",
            });
          }
        })
        .finally(() => {
          this.closeBetDialog();
        });
    },
  },
});

export function generateRaceBets(title: string, raceDate: string) {
  drivers.forEach((driver) => {
    const data = {
      title: `${title} ${driver} wins`,
      date: raceDate,
      category: "race",
      odds: 1,
      status: "ongoing",
    };
    $axios.post("http://localhost:8000/api/bets", data);
  });
}
