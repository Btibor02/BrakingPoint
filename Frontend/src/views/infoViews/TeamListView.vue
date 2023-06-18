<script setup lang="ts">
  import server from "..//..//store/axios.instance";
  import { useUsersStore } from "..//..//store/usersStore";
  import { ref } from "vue";

  const usersStore = useUsersStore();

  // csapat név és Url
  const teams = ref({
    teamID: "",
    name: "",
    teamUrl: "",
  });

  //csapat adatok lekérése
  server
    .get("api/showallteams")
    .then((res) => {
      teams.value = res.data;
    })
    .catch((err) => console.log(err));

  var bgColor1 = usersStore.getLoggedUser?.colour_palette?.slice(0, 7);
  var bgColor2 = usersStore.getLoggedUser?.colour_palette?.slice(7, 14);
  var logo = usersStore.getLoggedUser?.preferred_category;

  var bgColor = "linear-gradient(to bottom, " + bgColor1 + ", " + bgColor2 + ")";
  console.log(bgColor);
</script>

<template>
  <q-layout id="bg-color" :style="{ backgroundImage: bgColor }">
    <div id="bg-img" class="q-pa-md" :style="{ backgroundImage: logo }">
      <div>
        <p id="pageTitle" class="text-center q-pa-md">Jelenleg résztvevő csapatok</p>
      </div>
      <div>
        <div id="cardContainer" class="row q-gutter-lg">
          <q-card v-for="team in teams" :id="`cardAttributes-${team.teamUrl}`" :key="team.teamID">
            <q-img class="cardImage text-center" :src="`src/assets/teamsymbols/${team.teamUrl}.png`">
              <div class="cardShadow row">
                <router-link class="teamName" :to="`/teams/${team.teamUrl}`">
                  {{ team.name }}
                </router-link>
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<style lang="scss" scoped>
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

  @font-face {
    font-family: Wallpoet;
    src: url(src/assets/fonts/Wallpoet-Regular.otf);
  }
  #cardAttributes-ferrari {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: darkred;
    padding: 0.5em;
  }
  #cardAttributes-mercedes {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: rgb(75, 228, 255);
    padding: 0.5em;
  }
  #cardAttributes-red_bull {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: rgb(0, 0, 102);
    padding: 0.5em;
  }
  #cardAttributes-aston_martin {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: rgb(0, 151, 76);
    padding: 0.5em;
  }
  #cardAttributes-mclaren {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: orangered;
    padding: 0.5em;
  }
  #cardAttributes-alpine {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: rgb(64, 180, 219);
    padding: 0.5em;
  }
  #cardAttributes-haas {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: darkgray;
    padding: 0.5em;
  }
  #cardAttributes-alfa {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: rgb(30, 83, 65);
    padding: 0.5em;
  }
  #cardAttributes-alphatauri {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: rgb(64, 59, 122);
    padding: 0.5em;
  }
  #cardAttributes-williams {
    max-width: 20em;
    max-height: 21em;
    height: 21em;
    width: 16em;
    background-color: lightskyblue;
    padding: 0.5em;
  }
  .cardImage {
    max-width: 15em;
    max-height: fit-content;
    height: 20em;
  }
  .cardShadow {
    width: 100%;
    height: 100%;
  }

  #pageTitle {
    text-shadow: 0.1em 0.1em 0.1em black;
    font-size: large;
    color: white;
    letter-spacing: 0.15em;
  }
  .teamName {
    text-decoration: none;
    width: 100%;

    margin-top: 0%;
    margin-bottom: 20%;
    color: white;
    letter-spacing: 0.15em;
    font-weight: 1000;
    text-shadow: 0.1em 0.1em 0.1em black;
    font-size: 200%;
  }

  #cardContainer {
    width: 100%;
    justify-content: center;
  }
</style>
