<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
  import "animate.css";
  import { useUsersStore } from "..//store/usersStore";
  import { useAllUserStore } from "..//store/allUserStore";
  import { ref, isProxy, toRaw, onMounted } from "vue";
  import { useQuasar } from "quasar";

  const usersStore = useUsersStore();
  const allUserStore = useAllUserStore();

  var picture_frame = usersStore.getLoggedUser
    ? "../src/assets/" + usersStore.getLoggedUser.picture_frame
    : "../src/assets/bronze.png";

  var bgColor1 = usersStore.getLoggedUser?.colour_palette?.slice(0, 7);
  var bgColor2 = usersStore.getLoggedUser?.colour_palette?.slice(7, 14);
  var logo = usersStore.getLoggedUser?.preferred_category;

  var bgColor = "linear-gradient(to bottom, " + bgColor1 + ", " + bgColor2 + ")";

  var loaded = ref(false);
  var nameFirst = "";
  var nameSecond = "";
  var nameThird = "";

  var levelFirst = 0;
  var levelSecond = 0;
  var levelThird = 0;

  var pictureFrameFirst = "../src/assets/bronze.png";
  var pictureFrameSecond = "../src/assets/bronze.png";
  var pictureFrameThird = "../src/assets/bronze.png";

  var profPictureFirst = "..//assets/default.png";
  var profPictureSecond = "..//assets/default.png";
  var profPictureThird = "..//assets/default.png";

  const $q = useQuasar();

  onMounted(() => {
    $q.loading.show({
      message: "A ranglista épp töltődik. Kérem várjon!",
    });
    allUserStore.getAllUser.then((result) => {
      const users = result;
      let rawUsers = users;
      if (isProxy(users)) {
        rawUsers = toRaw(users);
        var sortedUsers = rawUsers!.sort((a, b) => b.level! - a.level!);
        nameFirst = sortedUsers[0].username!;
        nameSecond = sortedUsers[1].username!;
        nameThird = sortedUsers[2].username!;

        levelFirst = sortedUsers[0].level!;
        levelSecond = sortedUsers[1].level!;
        levelThird = sortedUsers[2].level!;

        pictureFrameFirst = "../src/assets/" + sortedUsers[0].picture_frame!;
        pictureFrameSecond = "../src/assets/" + sortedUsers[1].picture_frame!;
        pictureFrameThird = "../src/assets/" + sortedUsers[2].picture_frame!;

        profPictureFirst = sortedUsers[0].profile_picture!;
        profPictureSecond = sortedUsers[1].profile_picture!;
        profPictureThird = sortedUsers[2].profile_picture!;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      let timer = setTimeout(() => {
        $q.loading.hide();
        loaded.value = true;
      }, 500);
      return loaded.value;
    });
  });
</script>

<template>
  <q-layout id="bg-color" :style="{ backgroundImage: bgColor }">
    <div v-if="loaded" id="bg-img" class="q-pa-md" :style="{ backgroundImage: logo }">
      <div class="row">
        <div class="col-md-12 col-12">
          <div class="column">
            <div class="row justify-center">
              <h4 class="text-center" style="color: white">Ranglista</h4>
            </div>
            <div class="row flex-center">
              <!-- Rank 1 -->
              <div class="mobile-hide gt-md col-md-3 col-12">
                <div style="background-color: #d4af37; border-radius: 10%; height: 40em; width: 30em">
                  <div class="column items-center">
                    <h3 style="color: white">Top 1</h3>
                    <q-avatar style="height: 3.6em; width: 3.6em; text-align: left">
                      <q-img alt="PictureFrame" :src="pictureFrameFirst">
                        <q-avatar style="height: 2.8em; width: 2.8em; position: relative">
                          <q-img alt="ProfilePicture" :src="profPictureFirst" />
                        </q-avatar>
                      </q-img>
                    </q-avatar>
                    <h4 style="color: white">{{ nameFirst }}</h4>
                    <p style="color: white; font-size: 2em">{{ levelFirst }}</p>
                  </div>
                </div>
              </div>

              <div class="col-md-3 col-12">
                <div class="column">
                  <!-- If user's resolution lower than 1440x1920px  -->
                  <div class="lt-lg col-md-3 col-12 q-pb-sm">
                    <div
                      class="mobile-hide"
                      style="background-color: #d4af37; border-radius: 2.5em; height: 15em; width: 40em"
                    >
                      <div class="row q-pl-sm q-pt-md items-center">
                        <h3 style="color: white">1</h3>
                        <div class="q-pr-xl q-pl-xl">
                          <q-avatar style="height: 3.6em; width: 3.6em; text-align: left">
                            <q-img alt="PictureFrame" :src="pictureFrameFirst">
                              <q-avatar style="height: 2.8em; width: 2.8em; position: relative">
                                <q-img alt="ProfilePicture" :src="profPictureFirst" />
                              </q-avatar>
                            </q-img>
                          </q-avatar>
                        </div>
                        <h4 style="color: white; font-size: 2em">{{ nameFirst }}</h4>
                        <p class="q-pl-xl q-pt-sm" style="color: white; font-size: 1.7em">{{ levelFirst }}</p>
                      </div>
                    </div>

                    <!-- If user is on mobile  -->
                    <div class="desktop-hide col-md-3 col-12 q-pb-sm">
                      <div style="background-color: #d4af37; border-radius: 2.5em; height: 12em; width: 27em">
                        <div class="row q-pl-sm q-pt-md items-center">
                          <h3 style="color: white">1</h3>
                          <div class="q-pr-xl q-pl-xl">
                            <q-avatar style="height: 2em; width: 2em; text-align: left">
                              <q-img alt="PictureFrame" :src="pictureFrameFirst">
                                <q-avatar style="height: 1.4em; width: 1.4em; position: relative">
                                  <q-img alt="ProfilePicture" :src="profPictureFirst" />
                                </q-avatar>
                              </q-img>
                            </q-avatar>
                          </div>
                          <h4 style="color: white; font-size: 1.5em">{{ nameFirst }}</h4>
                          <p class="q-pl-lg q-pt-md" style="color: white; font-size: 1.2em">{{ levelFirst }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Rank 2 -->
                  <div class="desktop-hide col-md-4 col-12">
                    <div style="background-color: #c0c0c0; border-radius: 2.5em; height: 12em; width: 27em">
                      <div class="row q-pl-sm q-pt-md items-center">
                        <h4 style="color: white">2</h4>
                        <div class="q-pr-xl q-pl-xl">
                          <q-avatar style="height: 2em; width: 2em; text-align: left">
                            <q-img alt="PictureFrame" :src="pictureFrameSecond">
                              <q-avatar style="height: 1.4em; width: 1.4em; position: relative">
                                <q-img alt="ProfilePicture" :src="profPictureSecond" />
                              </q-avatar>
                            </q-img>
                          </q-avatar>
                        </div>
                        <h5 style="color: white; font-size: 1.5em">{{ nameSecond }}</h5>
                        <h5 class="q-pl-lg q-pt-sm" style="color: white; font-size: 1.2em">{{ levelSecond }}</h5>
                      </div>
                    </div>
                  </div>

                  <!-- Rank 3 -->
                  <div class="desktop-hide col-md-4 col-12 q-pt-sm">
                    <div style="background-color: #967444; border-radius: 2.5em; height: 12em; width: 27em">
                      <div class="row q-pl-sm q-pt-md items-center">
                        <h4 style="color: white">3</h4>
                        <div class="q-pr-xl q-pl-xl">
                          <q-avatar style="height: 2em; width: 2em; text-align: left">
                            <q-img alt="PictureFrame" :src="pictureFrameThird">
                              <q-avatar style="height: 1.4em; width: 1.4em; position: relative">
                                <q-img alt="ProfilePicture" :src="profPictureThird" />
                              </q-avatar>
                            </q-img>
                          </q-avatar>
                        </div>
                        <h5 style="color: white; font-size: 1.5em">{{ nameThird }}</h5>
                        <h5 class="q-pl-lg q-pt-sm" style="color: white; font-size: 1.2em">{{ levelThird }}</h5>
                      </div>
                    </div>
                  </div>

                  <!-- User's rank -->
                  <div class="desktop-hide col-md-4 col-12 q-pt-sm">
                    <div style="background-color: #1b1b1b; border-radius: 2.5em; height: 12em; width: 27em">
                      <div class="row q-pl-sm q-pt-md items-center">
                        <!-- TODO A felhasználó ranglistán elfoglalt helye -->
                        <h5 style="color: white">4</h5>
                        <div class="q-pr-xl q-pl-xl">
                          <q-avatar style="height: 1.6em; width: 1.6em; text-align: left">
                            <q-img alt="PictureFrame" :src="picture_frame">
                              <q-avatar style="height: 0.95em; width: 0.95em; position: relative">
                                <q-img alt="ProfilePicture" :src="usersStore.loggedUser?.profile_picture" />
                              </q-avatar>
                            </q-img>
                          </q-avatar>
                        </div>
                        <h6 style="color: white">{{ usersStore.loggedUser?.username }}</h6>
                        <h6 class="q-pl-lg" style="color: white; font-size: 1.2em">
                          {{ usersStore.loggedUser?.level }}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rank 2 -->
                <div class="col-md-4 col-12 mobile-hide">
                  <div style="background-color: #c0c0c0; border-radius: 2.5em; height: 12.5em; width: 40em">
                    <div class="row q-pl-sm q-pt-md items-center">
                      <h4 style="color: white">2</h4>
                      <div class="q-pr-xl q-pl-xl">
                        <q-avatar style="height: 2.6em; width: 2.6em; text-align: left">
                          <q-img alt="PictureFrame" :src="pictureFrameSecond">
                            <q-avatar style="height: 1.95em; width: 1.95em; position: relative">
                              <q-img alt="ProfilePicture" :src="profPictureSecond" />
                            </q-avatar>
                          </q-img>
                        </q-avatar>
                      </div>
                      <h5 style="color: white">{{ nameSecond }}</h5>
                      <h5 class="q-pl-xl" style="color: white; font-size: 1.5em">{{ levelSecond }}</h5>
                    </div>
                  </div>
                </div>

                <!-- Rank 3 -->
                <div class="col-md-4 col-12 q-pt-sm mobile-hide">
                  <div style="background-color: #967444; border-radius: 2.5em; height: 12.5em; width: 40em">
                    <div class="row q-pl-sm q-pt-md items-center">
                      <h4 style="color: white">3</h4>
                      <div class="q-pr-xl q-pl-xl">
                        <q-avatar style="height: 2.6em; width: 2.6em; text-align: left">
                          <q-img alt="PictureFrame" :src="pictureFrameThird">
                            <q-avatar style="height: 1.95em; width: 1.95em; position: relative">
                              <q-img alt="ProfilePicture" :src="profPictureThird" />
                            </q-avatar>
                          </q-img>
                        </q-avatar>
                      </div>
                      <h5 style="color: white">{{ nameThird }}</h5>
                      <h5 class="q-pl-xl" style="color: white; font-size: 1.5em">{{ levelThird }}</h5>
                    </div>
                  </div>
                </div>

                <!-- User's rank -->
                <div class="col-md-4 col-12 q-pt-sm mobile-hide">
                  <div style="background-color: #1b1b1b; border-radius: 2.5em; height: 12.5em; width: 40em">
                    <div class="row q-pl-sm q-pt-md items-center">
                      <!-- TODO A felhasználó ranglistán elfoglalt helye -->
                      <h5 style="color: white">4</h5>
                      <div class="q-pr-xl q-pl-xl">
                        <q-avatar style="height: 1.6em; width: 1.6em; text-align: left">
                          <q-img alt="PictureFrame" :src="picture_frame">
                            <q-avatar style="height: 0.95em; width: 0.95em; position: relative">
                              <q-img alt="ProfilePicture" :src="usersStore.loggedUser?.profile_picture" />
                            </q-avatar>
                          </q-img>
                        </q-avatar>
                      </div>
                      <h6 style="color: white">{{ usersStore.loggedUser?.username }}</h6>
                      <h6 class="q-pl-xl" style="color: white; font-size: 1.5em">
                        {{ usersStore.loggedUser?.level }}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
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
