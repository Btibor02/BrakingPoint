import { defineStore } from "pinia";

interface IState {
  showLoginDialog: boolean;
  showEditBetDialog: boolean;
  showNewBetDialog: boolean;
  showTicketDialog: boolean;
  showEndDialog: boolean;
}

export const useAppStore = defineStore({
  id: "appStore",
  state: (): IState => ({
    showLoginDialog: false,
    showEditBetDialog: false,
    showNewBetDialog: false,
    showTicketDialog: false,
    showEndDialog: false,
  }),
  persist: {
    enabled: true,
  },
});
