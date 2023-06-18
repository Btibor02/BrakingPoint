<!-- eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain -->
<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
  import { ref, reactive, computed } from "vue";
  import { useQuasar, Notify } from "quasar";
  import { useUsersStore } from "..//store/usersStore";

  const usersStore = useUsersStore();
  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

  const loggedUserHasVerifiedEmail = computed(() => (usersStore.getLoggedUser?.email_verified_at ? true : false));

  const $q = useQuasar();

  function onRejected(rejectedEntries: any) {
    $q.notify({
      type: "negative",
      message: `${rejectedEntries.length} fájl formátuma nem megfelelő!`,
    });
  }

  var isPwd = ref(true);
  var isPwdAgain = ref(true);
  var model = "";

  const options = [
    "RED BULL RACING RBPT",
    "FERRARI",
    "MERCEDES",
    "ALPINE RENAULT",
    "MCLAREN MERCEDES",
    "ALFA ROMEO FERRARI",
    "ASTON MARTIN ARAMCO MERCEDES",
    "HAAS FERRARI",
    "ALPHATAURI RBPT",
    "WILLIAMS MERCEDES",
  ];

  interface IReactiveData {
    userID: number;
    username: string;
    email: string;
    last_name: string;
    first_name: string;
    preferred_category: string;
    profile_picture: string;
    colour_palette: string;
  }

  interface IPassword {
    password: string;
    confirmPassword: string;
  }

  const informations = reactive<IReactiveData>({
    userID: usersStore.loggedUser?.userID!,
    username: usersStore.loggedUser?.username!,
    email: usersStore.loggedUser?.email!,
    last_name: usersStore.loggedUser?.last_name!,
    first_name: usersStore.loggedUser?.first_name!,
    preferred_category: usersStore.loggedUser?.preferred_category!,
    profile_picture: usersStore.loggedUser?.profile_picture!,
    colour_palette: usersStore.loggedUser?.colour_palette!,
  });

  const passwords = reactive<IPassword>({
    password: "",
    confirmPassword: "",
  });

  var filesImages = ref(null);
  var imageUrl = ref();
  function changeProfPic() {
    if (filesImages.value) {
      imageUrl.value = URL.createObjectURL(filesImages.value);
      console.log(imageUrl);
    }
  }

  var emailNotVerified = ref(false);
  if (loggedUserHasVerifiedEmail.value == false && anyLoggedUser.value != false) {
    emailNotVerified.value = true;
  } else {
    emailNotVerified.value = false;
  }

  var picture_frame = usersStore.getLoggedUser
    ? "../src/assets/" + usersStore.getLoggedUser.picture_frame
    : "../src/assets/bronze.png";

  var color = "";
  var color2 = "";
  var logo = "";
  function teamSelected() {
    switch (model) {
      case "RED BULL RACING RBPT":
        color = "#000B8D";
        color2 = "#000A82";
        logo = "url(../src/assets/bgImg/redbull.png)";
        break;
      case "FERRARI":
        color = "#EF1A2D";
        color2 = "#CB1626";
        logo = "url(../src/assets/bgImg/ferrari.png)";
        break;
      case "MERCEDES":
        color = "#00A19B";
        color2 = "#008883";
        logo = "url(../src/assets/bgImg/mercedes.png)";
        break;
      case "ALPINE RENAULT":
        color = "#0078C1";
        color2 = "#005BA9";
        logo = "url(../src/assets/bgImg/alpine.png)";
        break;
      case "MCLAREN MERCEDES":
        color = "#FF8000";
        color2 = "#EE7800";
        logo = "url(../src/assets/bgImg/mclaren.png)";
        break;
      case "ALFA ROMEO FERRARI":
        color = "#295294";
        color2 = "#981E32";
        logo = "url(../src/assets/bgImg/alfaromeo.png)";
        break;
      case "ASTON MARTIN ARAMCO MERCEDES":
        color = "#00594F";
        color2 = "#00352F";
        logo = "url(../src/assets/bgImg/astonmartin.png)";
        break;
      case "HAAS FERRARI":
        color = "#EFEFEF";
        color2 = "#AEAEAE";
        logo = "url(../src/assets/bgImg/haas.png)";
        break;
      case "ALPHATAURI RBPT":
        color = "#041F3D";
        color2 = "#011321";
        logo = "url(../src/assets/bgImg/alphatauri.png)";
        break;
      case "WILLIAMS MERCEDES":
        color = "#00A3E0";
        color2 = "#041E42";
        logo = "url(../src/assets/bgImg/williams.png)";
        break;

      default:
        color = "#a71616";
        color2 = "#6d0f0f";
        logo = "url(../src/assets/bgImg/tesztkep3)";
        break;
    }
    console.log(color);
  }

  async function save() {
    console.log(informations);
    var colors = `${color}${color2}`;
    console.log(colors, "");
    informations.preferred_category = logo;
    if (model == "") {
      informations.colour_palette = usersStore.loggedUser?.colour_palette!;
      informations.preferred_category = usersStore.loggedUser?.preferred_category!;
    } else {
      informations.colour_palette = colors;
      informations.preferred_category = logo;
    }

    if (imageUrl.value == null) {
      if (usersStore.loggedUser?.profile_picture == null || usersStore.loggedUser?.profile_picture == "default.png") {
        imageUrl.value = "../src/assets/default.png";
      } else {
        imageUrl.value = usersStore.loggedUser?.profile_picture;
      }
    }

    if (passwords.password != passwords.confirmPassword) {
      Notify.create({
        message: `A jelszavak nem egyeznek!`,
        color: "negative",
      });
    }
    if (passwords.password == "") {
      await usersStore.getSanctumCookie();
      await usersStore
        .editProfile({
          username: informations.username,
          email: informations.email,
          last_name: informations.last_name,
          first_name: informations.first_name,
          profile_picture: imageUrl.value,
          preferred_category: informations.preferred_category,
          colour_palette: informations.colour_palette,
        })
        .then(() => {
          Notify.create({
            message: `Felhasználó sikeresen módosítva`,
            color: "positive",
          });
          console.log(usersStore.loggedUser);
        })
        .catch((err) => {
          Notify.create({
            message: `Hiba a profil módosítása közben!`,
            color: "negative",
          });
          console.log(err);
        });
    } else {
      await usersStore.getSanctumCookie();
      await usersStore.editPassword({
        password: passwords.password,
      });
      await usersStore
        .editProfile({
          username: informations.username,
          email: informations.email,
          last_name: informations.last_name,
          first_name: informations.first_name,
          profile_picture: imageUrl.value,
          preferred_category: informations.preferred_category,
          colour_palette: informations.colour_palette,
        })
        .then(() => {
          Notify.create({
            message: `Felhasználó sikeresen módosítva`,
            color: "positive",
          });
          console.log(usersStore.loggedUser);
        })
        .catch((err) => {
          Notify.create({
            message: `Hiba a profil módosítása közben!`,
            color: "negative",
          });

          console.log(err);
        });
    }
  }

  var bgColor1 = usersStore.getLoggedUser?.colour_palette?.slice(0, 7);
  var bgColor2 = usersStore.getLoggedUser?.colour_palette?.slice(7, 14);
  var logo1 = usersStore.getLoggedUser?.preferred_category;

  var bgColor = "linear-gradient(to bottom, " + bgColor1 + ", " + bgColor2 + ")";
</script>

<template>
  <q-layout id="bg-color" :style="{ backgroundImage: bgColor }">
    <div v-if="emailNotVerified" class="q-pa-md q-gutter-sm q-pt-xl row justify-center">
      <q-banner class="bg-red text-white" style="max-width: 50em">
        Kérjük erősítse meg email címét! ({{ usersStore.loggedUser?.email }})
        <template #action>
          <q-btn
            color="white"
            flat
            label="Megerősítő email újraküldése"
            @click="usersStore.resendVerificationEmail()"
          />
        </template>
      </q-banner>
    </div>
    <div id="bg-img" class="q-pa-md" :style="{ backgroundImage: logo1 }">
      <div class="row">
        <div class="col-md-4 col-12">
          <div class="column items-center">
            <h3 style="color: white">Profil szerkesztése</h3>
            <q-avatar class="q-mt-xl" style="height: 6em; width: 6em">
              <q-img alt="PictureFrame" :src="picture_frame">
                <q-avatar class="q-mt-lg q-ml-lg" style="height: 4.5em; width: 4.5em">
                  <q-img alt="ProfilePicture" :src="usersStore.loggedUser?.profile_picture" />
                </q-avatar>
              </q-img>
            </q-avatar>

            <q-file
              v-model="filesImages"
              accept=".jpg, image/*"
              bg-color="dark"
              bottom-slots
              class="q-pa-md"
              color="dark"
              counter
              dark
              label="Profilkép cseréje"
              label-color="white"
              outlined
              rounded
              style="width: 20em; max-width: 20em"
              @rejected="onRejected"
              @update:model-value="changeProfPic()"
            >
              <template #prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
              <template #append>
                <q-icon class="cursor-pointer" name="close" @click.stop.prevent="filesImages = null" />
              </template>
              <template #hint>Csak kép formátum elfogadott!</template>
            </q-file>
          </div>
        </div>

        <div class="col-md-4 col-12">
          <p style="color: white">Felhasználónév</p>
          <q-input
            v-model="informations.username"
            bg-color="white"
            color="grey-6"
            :default="usersStore.loggedUser?.username"
            filled
            :label="usersStore.loggedUser?.username"
          />
          <p class="q-mt-lg" style="color: white">Vezetéknév</p>
          <q-input
            v-model="informations.last_name"
            bg-color="white"
            color="grey-6"
            :default="usersStore.loggedUser?.last_name"
            filled
            :label="usersStore.loggedUser?.last_name"
          />
          <p class="q-mt-lg" style="color: white">Keresztnév</p>
          <q-input
            v-model="informations.first_name"
            bg-color="white"
            color="grey-6"
            :default="usersStore.loggedUser?.first_name"
            filled
            :label="usersStore.loggedUser?.first_name"
          />
          <p class="q-mt-lg" style="color: white">E-mail</p>
          <q-input
            v-model="informations.email"
            bg-color="white"
            color="grey-6"
            :default="usersStore.loggedUser?.email"
            filled
            :label="usersStore.loggedUser?.email"
            type="email"
          />

          <p class="q-mt-lg" style="color: white">Jelszó</p>
          <q-input
            v-model="passwords.password"
            bg-color="white"
            color="grey-6"
            filled
            label="Jelszó"
            :type="isPwd ? 'password' : 'text'"
          >
            <template #append>
              <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <p class="q-mt-lg" style="color: white">Jelszó megerősitése</p>
          <q-input
            v-model="passwords.confirmPassword"
            bg-color="white"
            color="grey-6"
            filled
            label="Jelszó megerősítése"
            :type="isPwdAgain ? 'password' : 'text'"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                :name="isPwdAgain ? 'visibility_off' : 'visibility'"
                @click="isPwdAgain = !isPwdAgain"
              />
            </template>
          </q-input>
          <div class="column items-center">
            <q-btn class="vertical-middle q-mt-xl" color="black" label="Mentés" rounded @click="save" />
          </div>
        </div>
        <div class="col-md-4 col-12 q-pl-xl">
          <p style="color: white">Kedvenc csapat kiválasztása</p>
          <div class="row">
            <div class="col-md-8">
              <q-select
                v-model="model"
                bg-color="white"
                color="dark"
                filled
                label="Csapatok"
                :options="options"
                outlined
                style="max-width: 22em"
                @update:model-value="teamSelected()"
              />
            </div>
            <div class="col-md-4">
              <q-icon class="q-ml-md" color="blue" name="info" size="4em">
                <q-tooltip>
                  Kedvenc csapat kiválasztásával az oldal színe is megváltozik a választott csapat színeire
                </q-tooltip>
              </q-icon>
            </div>
          </div>
        </div>
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
</style>
