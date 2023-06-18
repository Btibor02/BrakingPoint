<script setup lang="ts">
  import { ref, isProxy, toRaw, onMounted } from "vue";
  import "animate.css";
  import { useUsersStore } from "..//store/usersStore";
  import { useAllUserStore } from "..//store/allUserStore";
  import server from "../store/axios.instance";
  import { useQuasar } from "quasar";

  const usersStore = useUsersStore();
  const allUserStore = useAllUserStore();
  const $q = useQuasar();
  var loaded = ref(false);

  // api kérések metódus

  function driverTeamBaseData() {
    server
      .get("api/storecompetitors")
      .then((res) => {
        console.log("Kérés elküldve");
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  function placementData() {
    server
      .get("api/storecurrentstandings")
      .then((res) => {
        console.log("Kérés elküldve");
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  function lastRaceScores() {
    server
      .get("api/storeracescores")
      .then((res) => {
        console.log("Kérés elküldve");
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }
  function currentSeasonRaces() {
    server
      .get("api/storecurrentseasonraces")
      .then((res) => {
        console.log("Kérés elküldve");
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  //Users
  const columns = [
    {
      name: "index",
      label: "#",
      field: (row: any) => row.index,
      format: (val: any) => `${val}`,
      sortable: true,
    },
    {
      name: "username",
      required: true,
      label: "Felhasználónév",
      sortable: true,
      align: "center",
    },
    { name: "firstName", align: "center", label: "Keresztnév", field: "firstName", sortable: true },
    { name: "lastName", align: "center", label: "Vezetéknév", field: "lastName", sortable: true },
    { name: "level", align: "center", label: "Szint", field: "level", sortable: true },
    { name: "balance", align: "center", label: "Egyenleg", field: "balance", sortable: true },
  ];
  let rows: any = ref([]);

  onMounted(() => {
    $q.loading.show({
      message: "Az admin felület épp töltődik. Kérem várjon!",
    });
    allUserStore.getAllUser.then((result) => {
      const users = result;
      let rawUsers = users;

      if (isProxy(users)) {
        rawUsers = toRaw(users);
        rawUsers?.forEach((element) => {
          rows.value.push({
            index: element.userID,
            username: element.username,
            firstName: element.first_name ? element.first_name : "-",
            lastName: element.last_name ? element.last_name : "-",
            balance: element.balance,
            level: element.level,
          });
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      let timer = setTimeout(() => {
        $q.loading.hide();
        loaded.value = true;
        console.log(rows);
      }, 500);
      return loaded.value, rows.value;
    });
  });

  //Bets
  const columnsBets = [
    {
      name: "desc",
      required: true,
      label: "#",
      align: "left",
      field: (row: any) => row.id,
      sortable: true,
    },
    { name: "Fogadás", align: "center", label: "Fogadás", field: "name", sortable: true },
    { name: "Verseny", align: "center", label: "Verseny", field: "race", sortable: true },
    { name: "Szorzó", align: "center", label: "Szorzó", field: "odd", sortable: true },
    { name: "Eredmény", align: "center", label: "Eredmény", field: "result" },
  ];

  const rowsBets = [
    {
      id: "1",
      name: "Max Verstappen világbajnok lesz",
      race: "X",
      odd: 1.2,
      result: "Nyert",
    },
    {
      id: "2",
      name: "Lewis Hamilton világbajnok lesz",
      race: "X",
      odd: 2.1,
      result: "Vesztett",
    },
    {
      id: "3",
      name: "Max Verstappen nyer",
      race: "Szaúd-arábiai nagydíj",
      odd: 1.1,
      result: "Nyert",
    },
    {
      id: "4",
      name: "George Russel nyer",
      race: "Magyar nagydíj",
      odd: 3.5,
      result: "Vesztett",
    },
    {
      id: "5",
      name: "Sergio Pérez nyer",
      race: "Szingapúri nagydíj",
      odd: 2.7,
      result: "Nyert",
    },
    {
      id: "6",
      name: "Charles Leclerc nyer",
      race: "Osztrák nagydíj",
      odd: 2.0,
      result: "Nyert",
    },
    {
      id: "7",
      name: "Valteri Bottas nyer",
      race: "Japán nagydíj",
      odd: 7.9,
      result: "Vesztett",
    },
  ];

  var filter = ref("");
  var loading = ref(false);
  var initialPagination: {
    sortBy: "desc";
    descending: false;
    page: 1;
    rowsPerPage: 25;
    // rowsNumber: xx if getting data from a server
  };

  var users = ref(true);
  var bets = ref(false);

  var usersButton = ref(true);
  var betsButton = ref(false);

  function usersButtonStyle() {
    if (usersButton.value) {
      return {
        height: "3.125em",
        width: "25em",
      };
    } else {
      return "";
    }
  }

  function betsButtonStyle() {
    if (betsButton.value) {
      return {
        height: "3.125em",
        width: "25em",
      };
    } else {
      return "";
    }
  }

  var bgColor1 = usersStore.getLoggedUser?.colour_palette?.slice(0, 7);
  var bgColor2 = usersStore.getLoggedUser?.colour_palette?.slice(7, 14);
  var logo = usersStore.getLoggedUser?.preferred_category;

  var bgColor = "linear-gradient(to bottom, " + bgColor1 + ", " + bgColor2 + ")";
  console.log(bgColor);
</script>
<template lang="">
  <q-layout id="bg-color" :style="{ backgroundImage: bgColor }">
    <div id="bg-img" class="q-pa-md" :style="{ backgroundImage: logo }">
      <div class="desktop-hide">
        <h2 class="text-bold text-center" style="color: white">Sajnáljuk!</h2>
        <h4 class="text-bold text-center" style="color: white">Ez a felület mobilon jelenleg nem elérhető!</h4>
      </div>
      <div class="row mobile-hide">
        <div class="col-md-12 col-12">
          <div class="column">
            <div class="row">
              <div class="col-md-9">
                <q-btn
                  color="dark"
                  dark
                  :style="usersButtonStyle"
                  @click="(users = true), (bets = false), (usersButton = true), (betsButton = false)"
                >
                  <h7 style="color: white">Felhasználók keresése</h7>
                </q-btn>
              </div>
              <div class="col-md-3">
                <q-btn
                  color="dark"
                  dark
                  :style="betsButtonStyle"
                  @click="(users = false), (bets = true), (usersButton = false), (betsButton = true)"
                >
                  <h7 style="color: white">Fogadások keresése</h7>
                </q-btn>
              </div>
            </div>

            <!-- Users -->
            <!-- TODO Ha változtatás történik küldjön egy értesítést az érintett felhasználóknak -->
            <div v-if="users" class="q-pa-md q-pr-xl animate__animated animate__fadeIn">
              <q-table
                v-if="loaded"
                binary-state-sort
                class="my-sticky-virtscroll-table"
                :columns="columns"
                dark
                :filter="filter"
                :grid="$q.screen.xs"
                :loading="loading"
                no-data-label="Nem található felhasználó"
                :pagination="initialPagination"
                row-key="index"
                :rows="rows"
                :rows-per-page-options="[0]"
                style="height: 35em"
                title="Felhasználók"
              >
                <template #top-right>
                  <q-input
                    v-model="filter"
                    bg-color="white"
                    borderless
                    debounce="300"
                    dense
                    label-color="white"
                    outlined
                    placeholder="Search"
                    rounded
                  >
                    <template #append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>

                <template #body="propsUsers">
                  <q-tr>
                    <q-btn
                      color="dark"
                      dense
                      :icon="propsUsers.expand ? 'close' : 'delete'"
                      round
                      size="md"
                      @click="propsUsers.expand = !propsUsers.expand"
                    />
                  </q-tr>
                  <q-inner-loading color="primary" />
                  <q-tr class="cards" :props="propsUsers">
                    <q-td key="index" :props="propsUsers">
                      {{ propsUsers.row.index }}
                    </q-td>
                    <q-td key="username" :props="propsUsers">
                      {{ propsUsers.row.username }}
                      <q-popup-edit v-slot="scope" v-model="propsUsers.row.username">
                        <q-input v-model="scope.value" autofocus counter dense type="textarea" />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="firstName" :props="propsUsers">
                      {{ propsUsers.row.firstName }}
                      <q-popup-edit v-slot="scope" v-model="propsUsers.row.firstName" buttons>
                        <q-input v-model="scope.value" autofocus dense type="textarea" />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="lastName" :props="propsUsers">
                      <div class="text-pre-wrap">{{ propsUsers.row.lastName }}</div>
                      <q-popup-edit v-slot="scope" v-model="propsUsers.row.lastName">
                        <q-input v-model="scope.value" autofocus dense type="textarea" />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="level" :props="propsUsers">
                      <div class="text-pre-wrap">{{ propsUsers.row.level }}</div>
                      <q-popup-edit v-slot="scope" v-model="propsUsers.row.level">
                        <q-input v-model="scope.value" autofocus dense type="number" />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="balance" :props="propsUsers">
                      <div class="text-pre-wrap">{{ propsUsers.row.balance }}</div>
                      <q-popup-edit v-slot="scope" v-model="propsUsers.row.balance">
                        <q-input v-model="scope.value" autofocus dense type="number" />
                      </q-popup-edit>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
              <div class="column items-center">
                <q-btn class="vertical-middle q-mt-xl" color="black" label="Mentés" rounded />
              </div>
            </div>

            <!-- Bets -->
            <div v-if="bets" class="q-pt-sm animate__animated animate__fadeIn">
              <div class="q-pa-md">
                <q-table
                  v-model:selected="selected"
                  :columns="columnsBets"
                  dark
                  :filter="filter"
                  row-key="name"
                  :rows="rowsBets"
                  title="Fogadások"
                >
                  <template #top-right>
                    <q-input
                      v-model="filter"
                      bg-color="white"
                      borderless
                      debounce="300"
                      dense
                      outlined
                      placeholder="Search"
                      rounded
                    >
                      <template #append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                  <template #header="propsBets">
                    <q-tr :props="propsBets">
                      <q-th auto-width />
                      <q-th v-for="col in propsBets.cols" :key="col.name" :props="props">
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <!-- Edit Bet -->
                  <template #body="propsBets">
                    <q-tr :props="propsBets">
                      <q-td auto-width>
                        <q-tr>
                          <q-btn
                            color="dark"
                            dense
                            :icon="propsBets.expand ? 'close' : 'info'"
                            round
                            size="sm"
                            @click="(propsBets.expand = !propsBets.expand), (cardBet = true)"
                          />
                        </q-tr>
                        <q-dialog v-model="cardBet">
                          <q-card bordered class="my-card" dark>
                            <q-card-section>
                              <div class="row no-wrap items-center">
                                <div class="col text-h6 ellipsis">#1 Teszt Fogadás</div>
                              </div>
                            </q-card-section>

                            <!-- TODO Változtathatóvá tenni -->
                            <q-card-section class="q-pt-none">
                              <div class="text-subtitle1">
                                <!-- <q-popup-edit v-slot="scope" v-model="props.row.race">
                                  <q-input v-model="scope.value" autofocus counter dense />
                                </q-popup-edit> -->
                                Verseny: X
                              </div>
                              <div class="text-subtitle1">
                                <!-- <q-popup-edit v-slot="scope" v-model="props.row.race">
                                  <q-input v-model="scope.value" autofocus counter dense />
                                </q-popup-edit> -->
                                Szorzó: 1.2
                              </div>
                              <div class="text-subtitle1">
                                <!-- <q-popup-edit v-slot="scope" v-model="props.row.race">
                                  <q-input v-model="scope.value" autofocus counter dense />
                                </q-popup-edit> -->
                                Eredmény: Nyert
                              </div>
                            </q-card-section>

                            <q-separator />

                            <q-card-actions align="right">
                              <q-btn
                                v-close-popup
                                flat
                                label="Mentés"
                                @click="(propsBets.expand = !propsBets.expand), (cardBet = false)"
                              />
                            </q-card-actions>
                          </q-card>
                        </q-dialog>
                      </q-td>
                      <q-td v-for="col in propsBets.cols" :key="col.name" :props="props">
                        {{ col.value }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="propsBets.expand" :props="propsBets" />
                  </template>
                </q-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- API kérés a versenyzőkről-->
      <div class="mobile-hide">
        <h5>Versenyzőkkel kapcsolatos adatok frissítése</h5>
        <q-btn
          class="vertical-middle q-ma-lg"
          color="black"
          label="Versenyzők/csapatok alap adatainak lekérése"
          rounded
          @click="driverTeamBaseData"
        />
        <q-btn
          class="vertical-middle q-ma-lg"
          color="black"
          label="Helyezések és pontok lekérése"
          rounded
          @click="placementData"
        />
        <q-btn
          class="vertical-middle q-ma-lg"
          color="black"
          label="A jelenlegi szezon versenyei"
          rounded
          @click="currentSeasonRaces"
        />
        <q-btn
          class="vertical-middle q-ma-lg"
          color="black"
          label="Legutóbbi verseny eredményei"
          rounded
          @click="lastRaceScores"
        />
      </div>
    </div>
  </q-layout>
</template>

<style lang="scss">
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

  .cards {
    background-color: #1b1b1b;
    color: white;
  }
  .my-sticky-virtscroll-table {
    height: 26em;
  }
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #1b1b1b;
    color: white;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:last-child th {
    top: 3em;
  }

  thead tr:first-child th {
    top: 0;
  }
</style>
