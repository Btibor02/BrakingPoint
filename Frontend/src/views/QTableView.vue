<script setup lang="ts">
  import { QTableProps } from "quasar";
  import { useBetStore } from "../store/betStore";
  import { useAppStore } from "../store/appStore";
  import { onMounted, watch } from "vue";
  import { storeToRefs } from "pinia";
  import { IColumns } from "../store/columns";
  import { generateRaceBets, useTicketsStore } from "../store/ticketsStore";
  import { useUsersStore } from "..//store/usersStore";

  const usersStore = useUsersStore();
  const betStore = useBetStore();
  const appStore = useAppStore();
  const ticketsStore = useTicketsStore();

  // isLoading variable is reactive, but we need convert to ref() for watch
  const { isLoading } = storeToRefs(betStore);
  watch(isLoading, () => {
    if (isLoading.value == false) {
      // if turn from true to false:
      onRequest({
        filter: betStore.filter,
        pagination: betStore.pagination,
      });
    }
  });

  const options = ["overall", "versus", "race", "special"];

  function columnsI18n(): IColumns[] {
    let columns: IColumns[] = [
      {
        name: "id",
        label: "id",
        field: "id",
        align: "left",
        sortable: true,
      },
      {
        name: "title",
        label: "title",
        field: "title",
        align: "left",
        sortable: true,
      },
      {
        name: "date",
        label: "date",
        field: "date",
        align: "left",
        sortable: true,
      },
      {
        name: "category",
        label: "category",
        field: "category",
        align: "left",
        sortable: true,
      },
      {
        name: "odds",
        label: "odds",
        field: "odds",
        align: "left",
        sortable: true,
      },
      {
        name: "odds2",
        label: "odds2",
        field: "odds2",
        align: "left",
        sortable: true,
      },
      {
        name: "status",
        label: "status",
        field: "status",
        align: "left",
        sortable: true,
      },
    ];
    return columns;
  }

  function onRequest(props: QTableProps) {
    if (props.pagination) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      betStore.pagination.page = page as number;
      betStore.pagination.rowsPerPage = rowsPerPage as number;
      betStore.pagination.sortBy = sortBy as string;
      betStore.pagination!.descending = descending as boolean;

      betStore.fetchBets(); // get bets
    }
  }

  onMounted(() => {
    // load posts on start
    onRequest({
      filter: betStore.filter,
      pagination: betStore.pagination,
    });
  });

  function editBet(): void {
    betStore.data = betStore.selected[0];
    betStore.getBetById();
    appStore.showEditBetDialog = true;
  }

  function newBet(): void {
    betStore.data = {};
    appStore.showNewBetDialog = true;
  }

  function submitEditBetDialog() {
    betStore.editBetById();
    onRequest({
      filter: betStore.filter,
      pagination: betStore.pagination,
    });
    appStore.showEditBetDialog = false;
  }

  function submitNewBetDialog() {
    betStore.createNewBet();
    appStore.showNewBetDialog = false;
  }
  function resetBetDialog() {
    onRequest({
      filter: betStore.filter,
      pagination: betStore.pagination,
    });
    appStore.showEditBetDialog = false;
    appStore.showNewBetDialog = false;
  }
  function generateDialog() {
    ticketsStore.showGenerateDialog = true;
  }
  function sendGenerateDialog() {
    generateRaceBets(betStore.title, betStore.raceDate);
    ticketsStore.showGenerateDialog = false;
  }
  function resetGenerateDialog() {
    ticketsStore.showGenerateDialog = false;
    betStore.raceDate = "";
    betStore.title = "";
  }
  function endBetDialog() {
    betStore.data = betStore.selected[0];
    appStore.showEndDialog = true;
  }
  function resetEndBet() {
    appStore.showEndDialog = false;
    betStore.win = false;
    betStore.winner = "";
  }
  function sendEndBet() {
    betStore.endBet();
    appStore.showEndDialog = false;
    betStore.win = false;
    betStore.winner = "";
  }
  var bgColor1 = usersStore.getLoggedUser?.colour_palette?.slice(0, 7);
  var bgColor2 = usersStore.getLoggedUser?.colour_palette?.slice(7, 14);
  var logo = usersStore.getLoggedUser?.preferred_category;

  var bgColor = "linear-gradient(to bottom, " + bgColor1 + ", " + bgColor2 + ")";
</script>

<template>
  <q-page id="bg-color" :style="{ backgroundImage: bgColor }">
    <div id="bg-img" class="q-pa-md" :style="{ backgroundImage: logo }">
      <div>
        <q-table
          v-model:selected="betStore.selected"
          binary-state-sort
          :columns="columnsI18n()"
          dark
          dense
          :filter="betStore.filter"
          :loading="betStore.isLoading"
          row-key="id"
          :rows="betStore.bets"
          :rows-per-page-label="'rowsPerPageLabel'"
          selection="multiple"
          :title="'bets'"
          wrap-cells
          @request="onRequest"
        >
          <!-- Search field -->
          <template #top-right>
            <q-input v-model="betStore.filter" debounce="500" dense :placeholder="'search'">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
        <!-- Action buttons: -->
        <div class="row justify-center q-ma-sm q-gutter-sm">
          <q-btn v-show="betStore.selected.length != 0" color="orange" no-caps @click="betStore.selected = []">
            {{ betStore.selected.length > 1 ? "clearSelections" : "clearSelection" }}
          </q-btn>
          <q-btn v-show="betStore.selected.length == 0" color="green" no-caps @click="newBet()">New Bet"</q-btn>
          <q-btn v-show="betStore.selected.length == 1" color="blue" no-caps @click="editBet()">"Edit Bet"</q-btn>
          <q-btn v-show="betStore.selected.length != 0" color="red" no-caps @click="betStore.deleteById()">
            {{ betStore.selected.length > 1 ? "Delete Bets" : "Delete Bet" }}
          </q-btn>
          <q-btn v-show="betStore.selected.length == 0" color="red" no-caps @click="generateDialog()">
            Generate Bets
          </q-btn>
          <q-btn v-show="betStore.selected.length == 1" color="green" no-caps @click="endBetDialog()">End Bet</q-btn>
        </div>
      </div>
      <!-- Edit post dialog: -->
      <q-dialog v-model="appStore.showEditBetDialog" persistent>
        <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
          <q-form class="q-mx-md" @reset="resetBetDialog()" @submit="submitEditBetDialog()">
            <div class="row">
              <div v-if="betStore.data" class="col-12 q-gutter-md">
                <h4 class="text-center q-mt-lg q-mb-none">editBet</h4>
                <q-input v-model="betStore.data.date" filled mask="date" :rules="['date']">
                  <template #append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date v-model="betStore.data.date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup color="primary" flat label="Close" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input v-model="betStore.data.title" filled :label="'title'" type="text" />
                <q-input v-model="betStore.data.category" filled :label="'category'" type="text" />
                <q-input v-model="betStore.data.odds" filled :label="'odds'" type="text" />
                <q-input v-model="betStore.data.odds2" filled :label="'odds2'" type="text" />
                <q-input v-model="betStore.data.status" filled :label="'status'" type="text" />
                <q-input v-model="betStore.data.sportID" filled :label="'sportID'" type="text" />
                <div class="row justify-center">
                  <q-btn class="q-mr-md" color="green" :label="'save'" no-caps type="submit" />
                  <q-btn class="q-mr-md" color="red" :label="'cancel'" no-caps type="reset" />
                </div>
              </div>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
      <!-- New post dialog: -->
      <q-dialog v-model="appStore.showNewBetDialog" persistent>
        <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
          <q-form class="q-mx-md" @reset="resetBetDialog()" @submit="submitNewBetDialog()">
            <div class="row">
              <div v-if="betStore.data" class="col-12 q-gutter-md">
                <h4 class="text-center q-mt-lg q-mb-none">newPost</h4>
                <q-input v-model="betStore.data.date" filled :label="'date'" mask="date" :rules="['date']">
                  <template #append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date v-model="betStore.data.date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup color="primary" flat label="Close" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input v-model="betStore.data.title" filled :label="'title'" type="text" />
                <q-select v-model="betStore.data.category" filled :label="'category'" :options="options" />
                <q-input v-model="betStore.data.odds" filled :label="'odds'" type="text" />
                <q-input
                  v-if="betStore.data.category == 'versus'"
                  v-model="betStore.data.odds2"
                  filled
                  :label="'odds2'"
                  type="text"
                />
                <div class="row justify-center">
                  <q-btn class="q-mr-md" color="green" :label="'save'" no-caps type="submit" />
                  <q-btn class="q-mr-md" color="red" :label="'cancel'" no-caps type="reset" />
                </div>
              </div>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
      <!-- Generate Bets Dialog -->
      <q-dialog v-model="ticketsStore.showGenerateDialog" persistent>
        <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
          <q-form class="q-mx-md" @reset="resetGenerateDialog()" @submit="sendGenerateDialog()">
            <div class="row">
              <div v-if="betStore.data" class="col-12 q-gutter-md">
                <h4 class="text-center q-mt-lg q-mb-none">newPost</h4>

                <q-input v-model="betStore.raceDate" filled :label="'Date'"></q-input>
                <q-input v-model="betStore.title" filled :label="'Title'" type="text" />
                <div class="row justify-center">
                  <q-btn class="q-mr-md" color="green" :label="'save'" no-caps type="submit" />
                  <q-btn class="q-mr-md" color="red" :label="'cancel'" no-caps type="reset" />
                </div>
              </div>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
      <!-- End Dialog -->
      <q-dialog v-model="appStore.showEndDialog" persistent>
        <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
          <q-form class="q-mx-md" @reset="resetEndBet()" @submit="sendEndBet()">
            <div class="row">
              <div v-if="betStore.data" class="col-12 q-gutter-md">
                <div v-if="betStore.data.category == 'versus'">
                  <q-radio v-model="betStore.winner" label="First driver" val="First"></q-radio>
                  <p>Choose</p>
                  <q-radio v-model="betStore.winner" label="Second driver" val="Second"></q-radio>
                </div>
                <q-checkbox v-model="betStore.win">Win?</q-checkbox>

                <div class="row justify-center">
                  <q-btn class="q-mr-md" color="green" :label="'save'" no-caps type="submit" />
                  <q-btn class="q-mr-md" color="red" :label="'cancel'" no-caps type="reset" />
                </div>
              </div>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<style style="sccs" scoped>
  #bg-color {
    background-image: v-bind(bgColor);
    background-size: cover;
    background-attachment: fixed;
  }

  #bg-img {
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
