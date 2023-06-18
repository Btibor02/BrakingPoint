<script setup lang="ts">
  import server from "../../store/axios.instance";
  import { useRoute } from "vue-router";

  import { ref } from "vue";

  const route = useRoute();
  console.log(route.params.teamUrl);

  const team = ref({});
  const drivers = ref({});

  var color = "";
  var color2 = "";
  var bgColor = "";

  server
    .get("api/getteambyteamurl/" + route.params.teamUrl)
    .then((res) => {
      team.value = res.data;
      server
        .get("api/getdriverbyteamid/" + team.value.teamID)
        .then((resp) => {
          drivers.value = resp.data;
          switch (route.params.teamUrl) {
            case "red_bull":
              color = "#000B8D";
              color2 = "#000A82";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "ferrari":
              color = "#EF1A2D";
              color2 = "#CB1626";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "mercedes":
              color = "#00A19B";
              color2 = "#008883";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "alpine":
              color = "#0078C1";
              color2 = "#005BA9";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "mclaren":
              color = "#FF8000";
              color2 = "#EE7800";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "alfa":
              color = "#295294";
              color2 = "#981E32";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "aston_martin":
              color = "#00594F";
              color2 = "#00352F";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "haas":
              color = "#EFEFEF";
              color2 = "#AEAEAE";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "alphatauri":
              color = "#041F3D";
              color2 = "#011321";
              bgColor = "linear-gradient(to bottom, " + color + ", " + color2 + ")";
              break;
            case "williams":
              color = "#00A3E0";
              color2 = "#041E42";
              bgColor = "linear-gradient(to bottom, #00A3E0, #041E42)";
              break;
            default:
              color = "#a71616";
              color2 = "#6d0f0f";
              bgColor = "linear-gradient(to bottom, #a71616, #6d0f0f)";
              break;
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
</script>

<template>
  <div :style="{ backgroundImage: bgColor }">
    <div class="row">
      <div class="col-lg-4 col-md-4 col-12 teamInfo q-pa-xl">
        <p id="teamName">{{ team.name }}</p>
        <q-img id="teamLogo" alt="Ferrari logo" :src="`/src/assets/teamsymbols/${team.teamUrl}.png`" />
        <div style="float: inline-start">
          <p id="teamStatistics">
            Nemzetiség: {{ team.nationality }}
            <br />
            Jelenlegi helyezés: {{ team.position }}.
          </p>
        </div>
      </div>
      <div class="row col-lg-8">
        <div v-for="driver in drivers" class="col-lg-6 col-md-6 col-sm-6 col-12 racerInfo q-pt-xl">
          <div class="row text-center" style="display: flex; justify-content: center">
            <q-img :alt="driver.name" class="racerPicture" :src="`/src/assets/teammembers/${driver.driverUrl}.png`" />
            <router-link class="racerName" :to="`/drivers/${driver.driverUrl}`">{{ driver.name }}</router-link>
          </div>
        </div>
      </div>
    </div>

    <div id="teamDescriptionBackground" style="border: 0.5em solid" :style="{ color: color }">
      <p id="teamDescription">
        {{ team.description }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @font-face {
    font-family: Wallpoet;
    src: url(src/assets/fonts/Wallpoet-Regular.otf);
  }

  #teamDescriptionBackground {
    box-sizing: border-box;
    margin: auto;
    margin-top: 2rem;
    position: relative;
    width: 90%;
    opacity: 1;
    border-radius: 3em;
    padding: 1rem;
    box-shadow: 0px 4px 10px 10px rgba(0, 0, 0, 0.25);
  }

  #teamDescription {
    padding: 0.75rem;
    font-family: "Yrsa";
    font-style: normal;
    font-weight: 400;
    font-size: 1.5em;
    line-height: 1.1em;
    letter-spacing: 0.1em;
    word-wrap: normal;
    color: #ffffff;
  }

  #teamInfo {
    display: inline-block;
  }

  #teamLogo {
    max-width: 12rem;
  }

  #teamName {
    font-family: "Wallpoet";
    font-style: normal;
    font-weight: 400;
    font-size: 3em;
    line-height: 1em;
    letter-spacing: 0.3em;
    color: #ffffff;
  }

  #teamStatistics {
    color: white;
    font-family: "Yrsa";
    font-style: normal;
    font-weight: 600;
    font-size: 1.5em;
    line-height: 1.5em;
    letter-spacing: 0.2em;
  }

  .racerInfo {
    justify-content: center;
  }

  .racerName {
    text-decoration: none;

    position: relative;
    font-family: "Wallpoet";
    font-style: normal;
    font-weight: 400;
    font-size: 2em;
    line-height: 1em;
    letter-spacing: 0.1em;
    margin-top: 0.5em;
    color: #ffffff;

    width: 100%;
  }

  .racerPicture {
    height: 15em;
    width: 15em;
    box-shadow: 0px 4px 10px 10px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: block;
  }
</style>
