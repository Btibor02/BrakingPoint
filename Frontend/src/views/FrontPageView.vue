<script setup lang="ts">
  import server from "../store/axios.instance";
  import { useUsersStore } from "..//store/usersStore";
  import { ref } from "vue";

  // verseny kép, név, dátum és helyszín lekérése az adatbázisból
  const race = ref({
    circuitName: "",
    circuitUrl: "",
    country: "",
    date: "",
  });

  var bgImage = "";

  //a következő verseny adatainak lekérése
  server
    .get("api/shownextrace")
    .then((res) => {
      console.log("proba");
      race.value = res.data;
      bgImage = "/src/assets/backgrounds/" + race.value.circuitUrl + ".png";
      console.log(race.value);
    })
    .catch((err) => console.log(err));

  //versenyzők lekérése az adatbázisból
  const topDrivers = ref({
    competitorID: "",
    name: "",
    position: "",
    points: "",
  });

  server
    .get("api/gettopcompetitors")
    .then((res) => {
      console.log("proba2");
      topDrivers.value = res.data;
      console.log(topDrivers.value);
    })
    .catch((err) => console.log(err));

  //előző verseny top 5 versenyzőjének lekérése az adatbázisból
  const lastRaceTopDrivers = ref({
    competitorID: "",
    name: "",
    position: "",
  });

  server
    .get("api/getlastracetopcompetitors")
    .then((res) => {
      console.log("proba3");
      lastRaceTopDrivers.value = res.data;
      console.log(lastRaceTopDrivers.value);
    })
    .catch((err) => console.log(err));

  const usersStore = useUsersStore();

  var bgColor1 = usersStore.getLoggedUser?.colour_palette?.slice(0, 7);
  var bgColor2 = usersStore.getLoggedUser?.colour_palette?.slice(7, 14);

  var bgColor = "linear-gradient(to bottom, " + bgColor1 + ", " + bgColor2 + ")";
</script>

<template>
  <q-layout :style="{ backgroundImage: bgColor }">
    <div class="q-pb-xl">
      <div
        class="row"
        :style="{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage}) left center / cover no-repeat`,
        }"
      >
        <div class="q-pl-md col-xs-12 col-sm-12 col-md-12 col-lg-5">
          <div id="circuitCountry">{{ race.country }}</div>
          <div id="circuitName">{{ race.circuitName }}</div>
          <div id="raceDate">{{ race.date }}</div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7">
          <q-img id="circuitPlanImage" :src="`/src/assets/circuitimages/${race.circuitUrl}.png`" />
        </div>
      </div>
      <div class="row">
        <div id="lastRaceResults" class="col-xs-12 col-sm-12 col-md-6">
          <p id="lastRaceResultsTitle">Előző verseny helyezettjei</p>
          <p v-for="lastRaceTopDriver in lastRaceTopDrivers" :key="lastRaceTopDriver.competitorID" class="placements">
            {{ lastRaceTopDriver.position }}. {{ lastRaceTopDriver.name }}
          </p>
        </div>
        <div id="seasonsResults" class="col-xs-12 col-sm-12 col-md-6">
          <p id="seasonsResultsTitle">A szezon legjobbjai</p>
          <p v-for="topDriver in topDrivers" :key="topDriver.competitorID" class="placements">
            {{ topDriver.position }}. {{ topDriver.name }} - {{ topDriver.points }} pt
          </p>
        </div>
      </div>
      <div class="row">
        <div id="seasonsResults" class="col-lg-6"></div>
      </div>
    </div>
  </q-layout>
</template>

<style lang="scss" scoped>
  @font-face {
    font-family: Wallpoet;
    src: url(src/assets/fonts/Wallpoet-Regular.otf);
  }
  @font-face {
    font-family: Formula1;
    src: url(src/assets/fonts/Formula1-Regular.otf);
  }
  @font-face {
    font-family: Formula1_Bold;
    src: url(src/assets/fonts/Formula1-Bold.otf);
  }

  #backgroundImage {
    position: absolute;
    top: 12em;
    width: 80em;
  }

  #bgColor {
    padding: 0px;
  }

  #circuitCountry {
    font-family: Formula1;
    font-size: 7em;
    color: white;
  }

  #circuitPlanImage {
    margin-left: 4em;
    margin-bottom: 3em;
    margin-top: 2em;
    width: 75%;
  }

  #circuitName {
    font-family: Formula1_Bold;
    font-size: 3em;
    color: white;

    margin-top: -0.5em;
  }

  #lastRaceResults {
    text-align: right;
    border-right: 0.05em solid white;
    width: 50%;

    padding-right: 1em;
  }

  #lastRaceResultsTitle {
    font-family: Formula1;
    font-size: 2em;
    color: white;

    text-align: center;
    padding-top: 1em;
    padding-bottom: 1em;
  }

  #raceDate {
    font-family: Formula1;
    font-size: 2em;
    color: white;
  }

  #seasonsResults {
    text-align: left;
    border-left: 0.05em solid white;
    width: 50%;
    padding-left: 1em;
  }

  #seasonsResultsTitle {
    font-family: Formula1;
    font-size: 2em;
    color: white;

    text-align: center;
    padding-top: 1em;
    padding-bottom: 1em;
  }

  .placements {
    font-family: Formula1;
    font-size: 2em;
    color: white;
  }
</style>
