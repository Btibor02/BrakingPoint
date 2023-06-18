<script setup lang="ts">
  import server from "../../store/axios.instance";
  import { useRoute } from "vue-router";

  import { ref } from "vue";

  const route = useRoute();
  console.log(route.params.driverUrl);

  const team = ref({});
  const driver = ref({});

  var color = "";
  var color2 = "";
  var bgColor = "";

  server
    .get("api/getdriverbydriverurl/" + route.params.driverUrl)
    .then((res) => {
      driver.value = res.data;
      server
        .get("api/getteambyteamid/" + driver.value.teamID)
        .then((resp) => {
          team.value = resp.data;
          console.log(team.value.teamUrl);
          switch (team.value.teamUrl) {
            case "red_bull":
              color = "#000B8D";
              color2 = "#000A82";
              break;
            case "ferrari":
              color = "#EF1A2D";
              color2 = "#CB1626";
              break;
            case "mercedes":
              color = "#00A19B";
              color2 = "#008883";
              break;
            case "alpine":
              color = "#0078C1";
              color2 = "#005BA9";
              break;
            case "mclaren":
              color = "#FF8000";
              color2 = "#EE7800";
              break;
            case "alfa":
              color = "#295294";
              color2 = "#981E32";
              break;
            case "aston_martin":
              color = "#00594F";
              color2 = "#00352F";
              break;
            case "haas":
              color = "#EFEFEF";
              color2 = "#AEAEAE";
              break;
            case "alphatauri":
              color = "#041F3D";
              color2 = "#011321";
              break;
            case "williams":
              color = "#00A3E0";
              color2 = "#041E42";
              bgColor = "linear-gradient(to bottom, #00A3E0, #041E42)";
              break;
            default:
              color = "#a71616";
              color2 = "#6d0f0f";
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
      <div class="col-lg-6">
        <q-img id="driverImage" :src="`/src/assets/teammembers/${driver.driverUrl}.png`" />
      </div>
      <div class="col-lg-6">
        <p id="driverName">{{ driver.name }}</p>
        <p id="dob">({{ driver.dateOfBirth }})</p>
        <p class="driverInfo">
          Nemzetiség: {{ driver.nationality }}
          <br />
        </p>
        <p class="driverInfo">
          Pontjainak száma: {{ driver.points }}
          <br />
        </p>
        <p class="driverInfo">
          Szezonbeli helyezés: {{ driver.position }}.
          <br />
        </p>
      </div>
    </div>

    <div style="position: relative"></div>
    <div id="driverDescriptionBackground">
      <p id="driverDescription">
        {{ driver.description }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @font-face {
    font-family: Wallpoet;
    src: url(src/assets/fonts/Wallpoet-Regular.otf);
  }

  #driverDescription {
    padding: 0.75rem;
    font-family: "Yrsa";
    font-style: normal;
    font-weight: 400;
    font-size: 1.5em;
    line-height: 1em;
    letter-spacing: 0.1em;
    word-wrap: normal;
    color: #ffffff;
  }

  #driverDescriptionBackground {
    box-sizing: border-box;
    margin: auto;
    margin-top: 2rem;
    position: relative;
    width: 90%;
    border: 0.5em solid #a11717;
    opacity: 1;
    border-radius: 3em;
    padding: 1rem;
    box-shadow: 0px 4px 10px 10px rgba(0, 0, 0, 0.25);
  }

  #driverName {
    position: relative;
    font-family: "Wallpoet";
    font-style: normal;
    font-weight: 400;
    font-size: 4em;
    line-height: 1em;
    letter-spacing: 0.1em;
    margin-top: 0.5em;
    margin-bottom: 1em;
    color: #ffffff;
  }

  #teamSymbolImage {
    height: 15em;
    width: 15em;
    box-shadow: 0px 4px 10px 10px rgba(0, 0, 0, 0.25);
  }

  #driverImage {
    width: 20em;
    margin: 2em;
    box-shadow: 0px 4px 10px 10px rgba(0, 0, 0, 0.25);
  }
  #dob {
    color: darkgray;
    font-family: "Yrsa";
    font-style: normal;
    font-weight: 600;
    letter-spacing: 1em;
    opacity: 0.5;

    position: relative;
    margin-left: 3em;
    margin-top: -4em;
    margin-bottom: 2em;
  }

  .driverInfo {
    position: relative;
    color: white;
    font-family: "Yrsa";
    font-style: normal;
    font-weight: 600;
    font-size: 1.5em;
    letter-spacing: 0.2em;
    margin-left: 1.5em;
  }
</style>
