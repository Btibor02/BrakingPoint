<script setup lang="ts">
  import { useUsersStore } from "..//store/usersStore";
  import { ref, reactive, computed } from "vue";
  import { decodeCredential } from "vue3-google-login";
  import { Notify } from "quasar";

  const usersStore = useUsersStore();

  const anyLoggedUser = computed(() => (usersStore.loggedUser ? true : false));

  const isPwd = ref(true);
  const checkbox = ref(false);
  const terms = ref(false);

  var loginState = ref(true);
  var registrationState = ref(false);

  var isPwdAgain = ref(true);
  var isPwdLogin = ref(true);

  interface IReactiveData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface PasswordValidators {
    length: boolean;
    capitalLetter: boolean;
    number: boolean;
    symbol: boolean;
  }

  const validPassword = reactive<PasswordValidators>({
    length: false,
    capitalLetter: false,
    number: false,
    symbol: false,
  });

  const informationsLogin = reactive<IReactiveData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const informationsReg = reactive<IReactiveData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function validatePassword(password: string): boolean {
    validPassword.length = password.length >= 8;
    validPassword.capitalLetter = /^(?=.*[A-Z])/.test(password);
    validPassword.number = /^(?=.*[0-9])/.test(password);
    validPassword.symbol = /^(?=.*[!@#$%^&*_\-=+])/.test(password);
    return validPassword.length && validPassword.capitalLetter && validPassword.number && validPassword.symbol;
  }

  const callback = (response: any) => {
    console.log("Handle the response", response);
    const userData = decodeCredential(response.credential);
    console.log("Handle the userData", userData);
    const { email, sub } = userData;
    console.log(email, sub);
    usersStore.googleAuth({
      username: email,
      email: email,
      password: sub,
      confirmPassword: sub,
    });
  };

  async function login() {
    await usersStore.getSanctumCookie();
    if (!anyLoggedUser.value) {
      await usersStore
        .login({
          email: informationsLogin.email,
          password: informationsLogin.password,
        })
        .then(() => {
          console.log(anyLoggedUser.value);
        });
    } else {
      usersStore.logOut();
    }
  }

  async function register() {
    if (checkbox.value == false) {
      Notify.create({
        message: `Fogadja el a felhasználási feltételeket`,
        color: "negative",
      });
    } else {
      if (informationsReg.password != informationsReg.confirmPassword) {
        Notify.create({
          message: `A jelszavak nem egyeznek!`,
          color: "negative",
        });
      } else {
        if (!validPassword.length || !validPassword.capitalLetter || !validPassword.number || !validPassword.symbol) {
          Notify.create({
            message: `A jelszó nem megfelelő!`,
            color: "negative",
          });
        } else {
          await usersStore.getSanctumCookie();
          if (!anyLoggedUser.value) {
            await usersStore.register({
              username: informationsReg.username,
              email: informationsReg.email,
              password: informationsReg.password,
              confirmPassword: informationsReg.confirmPassword,
            });
          } else {
            usersStore.logOut();
          }
        }
      }
    }
  }
</script>

<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-8 col-12">
          <div v-if="loginState" class="column items-center animate__animated animate__fadeInDown">
            <!-- Login -->
            <h3 style="color: white">Belépés</h3>
            <div class="mobile-hide q-gutter-sm">
              <GoogleLogin v-if="!anyLoggedUser" :callback="callback" />
              <q-btn
                v-if="!anyLoggedUser"
                class="q-mb-xl"
                color="blue"
                label="Belépés Facebookkal"
                style="height: 3.1em; width: 15em"
                @click="usersStore.facebookLogin()"
              />
            </div>
            <div class="mobile-hide">
              <p class="text-center" style="color: white"><sub>vagy</sub></p>
              <p style="color: white">E-mail</p>
              <q-input
                v-model="informationsLogin.email"
                bg-color="white"
                color="grey-6"
                label="E-mail"
                outlined
                rounded
                style="width: 37em; max-width: 37em"
                type="email"
              />
              <p class="q-mt-md" style="color: white">Jelszó</p>
              <q-input
                v-model="informationsLogin.password"
                bg-color="white"
                color="grey-6"
                label="Jelszó"
                outlined
                rounded
                style="width: 37em; max-width: 37em"
                text-dark
                :type="isPwdLogin ? 'password' : 'text'"
              >
                <template #append>
                  <q-icon
                    class="cursor-pointer"
                    :name="isPwdLogin ? 'visibility_off' : 'visibility'"
                    @click="isPwdLogin = !isPwdLogin"
                  />
                </template>
              </q-input>
              <!-- <q-btn class="q-mt-md" flat label="Elfelejtette jelszavát?" style="color: white" /> -->
              <div class="column items-center">
                <q-btn
                  class="vertical-middle q-mt-xl"
                  color="black"
                  :label="anyLoggedUser ? 'Kijelentkezés' : 'Belépés'"
                  rounded
                  @click="login"
                />
              </div>
            </div>

            <!-- mobile view -->
            <div class="desktop-hide">
              <GoogleLogin v-if="!anyLoggedUser" :callback="callback" class="q-pl-xl" />
              <q-btn
                v-if="!anyLoggedUser"
                class="q-mb-xl q-ml-xl"
                color="blue"
                label="Belépés Facebookkal"
                style="height: 3.1em; width: 15em"
                @click="usersStore.facebookLogin()"
              />
            </div>
            <div class="desktop-hide">
              <p style="color: white"><sub>vagy</sub></p>
              <p style="color: white">E-mail</p>
              <q-input
                v-model="informationsLogin.email"
                bg-color="white"
                color="grey-6"
                label="E-mail"
                outlined
                rounded
                style="width: 20em; max-width: 20em"
                type="email"
              />
              <p class="q-mt-md" style="color: white">Jelszó</p>
              <q-input
                v-model="informationsLogin.password"
                bg-color="white"
                color="grey-6"
                label="Jelszó"
                outlined
                rounded
                style="width: 20em; max-width: 20em"
                text-dark
                :type="isPwdLogin ? 'password' : 'text'"
              >
                <template #append>
                  <q-icon
                    class="cursor-pointer"
                    :name="isPwdLogin ? 'visibility_off' : 'visibility'"
                    @click="isPwdLogin = !isPwdLogin"
                  />
                </template>
              </q-input>
              <q-btn class="q-mt-md" flat label="Elfelejtette jelszavát?" style="color: white" />
              <div class="column items-center">
                <q-btn
                  class="vertical-middle q-mt-xl"
                  color="black"
                  :label="anyLoggedUser ? 'Kijelentkezés' : 'Belépés'"
                  rounded
                  @click="login"
                />
              </div>
            </div>
          </div>

          <!-- Registration -->
          <div v-if="registrationState" class="column items-center animate__animated animate__fadeInDown">
            <h3 style="color: white">Regisztráció</h3>
            <div class="mobile-hide">
              <p style="color: white">Felhasználónév</p>
              <q-input
                v-model="informationsReg.username"
                bg-color="white"
                color="grey-6"
                label="Felhasználónév"
                outlined
                rounded
                style="width: 37em; max-width: 37em"
              />
              <p class="q-mt-md" style="color: white">E-mail</p>
              <q-input
                v-model="informationsReg.email"
                bg-color="white"
                color="grey-6"
                label="E-mail"
                outlined
                rounded
                style="width: 37em; max-width: 37em"
                type="email"
              />

              <p class="q-mt-md" style="color: white">Jelszó</p>
              <q-input
                v-model="informationsReg.password"
                bg-color="white"
                color="grey-6"
                label="Jelszó"
                outlined
                rounded
                style="width: 37em; max-width: 37em"
                :type="isPwd ? 'password' : 'text'"
                @update:model-value="validatePassword(informationsReg.password)"
              >
                <template #append>
                  <q-icon
                    class="cursor-pointer"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <p class="q-mt-md" style="color: white">Jelszó megerősitése</p>
              <q-input
                v-model="informationsReg.confirmPassword"
                bg-color="white"
                color="grey-6"
                label="Jelszó megerősítése"
                outlined
                rounded
                style="width: 37em; max-width: 37em"
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
              <div class="q-pa-sm q-pt-md">
                <div>
                  <q-icon
                    :color="validPassword.length ? 'positive' : 'negative'"
                    :name="validPassword.length ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak minimum 8 karakterből kell állnia!
                </div>
                <div>
                  <q-icon
                    :color="validPassword.capitalLetter ? 'positive' : 'negative'"
                    :name="validPassword.capitalLetter ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak legalább egy nagybetűt kell tartalmaznia!
                </div>
                <div>
                  <q-icon
                    :color="validPassword.number ? 'positive' : 'negative'"
                    :name="validPassword.number ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak legalább egy számot kell tartalmaznia!
                </div>
                <div>
                  <q-icon
                    :color="validPassword.symbol ? 'positive' : 'negative'"
                    :name="validPassword.symbol ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak legalább egy szimbólumot kell tartalmaznia!
                </div>
              </div>
              <q-dialog v-model="terms">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Felhasználási feltételek</div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section class="scroll" style="max-height: 50vh">
                    <p>
                      Mi is az a BrakingPoint?
                      <br />
                      A BrakingPoint egy jelenleg Formula 1-re kiéleződött (később kibővíthető a többi motorsportra is)
                      fogadó- és információszerző oldal. Ahol az oldal látogatói bejelentkezés nélkül tekinthetik meg a
                      csapatok és versenyzők adatait, sikereit. Ezen felül oldalunk szórakozásra is biztosít
                      lehetőséget, valódi tét nélküli fogadásokként, melyek még izgalmasabbá teszik a futamok nézését.
                      <br />
                      Célja
                      <br />
                      Projektünk célja, hogy egyszerűen, modern környezetben tudják a felhasználók elolvasni kedvenc
                      csapatuk vagy akár pilótájuk minden adatát, a nevétől kezdve egészen az elért eredményekig. A
                      fogadásnak hála összemérhetik tudásukat, ezáltal az unalmasabb futamokat is könnyedén izgalmassá
                      tehetik.
                    </p>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions align="right">
                    <q-btn v-close-popup color="negative" flat label="Nem fogadom el" @click="checkbox = false" />
                    <q-btn v-close-popup color="positive" flat label="Elfogadom" @click="checkbox = true" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <div>
                <q-checkbox
                  v-model="checkbox"
                  color="dark"
                  keep-color
                  label="Elfogadom a felhasználási feltételeket"
                  left-label
                  style="color: white"
                  @click="terms = true"
                />
              </div>
              <div class="column items-center">
                <q-btn class="vertical-middle q-mt-xl" color="black" label="Regisztrálás" rounded @click="register" />
              </div>
            </div>

            <!-- mobile view -->
            <div class="desktop-hide">
              <p style="color: white">Felhasználónév</p>
              <q-input
                v-model="informationsReg.username"
                bg-color="white"
                color="grey-6"
                label="Felhasználónév"
                outlined
                rounded
                style="width: 20em; max-width: 20em"
              />
              <p class="q-mt-md" style="color: white">E-mail</p>
              <q-input
                v-model="informationsReg.email"
                bg-color="white"
                color="grey-6"
                label="E-mail"
                outlined
                rounded
                style="width: 20em; max-width: 20em"
                type="email"
              />

              <p class="q-mt-md" style="color: white">Jelszó</p>
              <q-input
                v-model="informationsReg.password"
                bg-color="white"
                color="grey-6"
                label="Jelszó"
                outlined
                rounded
                style="width: 20em; max-width: 20em"
                :type="isPwd ? 'password' : 'text'"
                @update:model-value="validatePassword(informationsReg.password)"
              >
                <template #append>
                  <q-icon
                    class="cursor-pointer"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <p class="q-mt-md" style="color: white">Jelszó megerősitése</p>
              <q-input
                v-model="informationsReg.confirmPassword"
                bg-color="white"
                color="grey-6"
                label="Jelszó megerősítése"
                outlined
                rounded
                style="width: 20em; max-width: 20em"
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
              <div class="q-pa-sm q-pt-md">
                <div>
                  <q-icon
                    :color="validPassword.length ? 'positive' : 'negative'"
                    :name="validPassword.length ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak minimum 8 karakterből kell állnia!
                </div>
                <div>
                  <q-icon
                    :color="validPassword.capitalLetter ? 'positive' : 'negative'"
                    :name="validPassword.capitalLetter ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak legalább egy nagybetűt kell tartalmaznia!
                </div>
                <div>
                  <q-icon
                    :color="validPassword.number ? 'positive' : 'negative'"
                    :name="validPassword.number ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak legalább egy számot kell tartalmaznia!
                </div>
                <div>
                  <q-icon
                    :color="validPassword.symbol ? 'positive' : 'negative'"
                    :name="validPassword.symbol ? 'check_circle' : 'cancel'"
                  ></q-icon>
                  A jelszónak legalább egy szimbólumot kell tartalmaznia!
                </div>
              </div>
              <div>
                <q-checkbox
                  v-model="checkbox"
                  color="dark"
                  keep-color
                  label="Elfogadom a felhasználási feltételeket"
                  left-label
                  style="color: white"
                  @click="terms = true"
                />
              </div>
              <div class="column items-center">
                <q-btn class="vertical-middle q-mt-xl" color="black" label="Regisztrálás" rounded @click="register" />
              </div>
            </div>
          </div>
        </div>

        <!-- Login -->
        <div
          v-if="loginState"
          class="col-md-4 col-12 column items-center q-pa-md animate__animated animate__fadeInDown"
          rounded
          style="background-color: #1b1b1b; border-radius: 15%; height: 50em"
        >
          <q-parallax :height="1500">
            <video
              autoplay
              height="1500"
              loop
              muted
              no-controls
              poster="http://thumb.multicastmedia.com/thumbs/aid/w/h/t1351705158/1571585.jpg"
              src="..//assets/f1opening.mp4"
              style="opacity: 0.5"
              width="1200"
            />
            <div class="column items-center absolute-center">
              <h4 style="color: white; width: 10em">Még nem regisztrált?</h4>
              <p style="color: white">Hozzon létre fiókot, hogy Ön is csatlakozzon!</p>
              <q-btn
                v-if="!anyLoggedUser"
                class="vertical-middle q-mt-xl"
                color="black"
                label="Regisztráció"
                rounded
                @click="(registrationState = true), (loginState = false)"
              />
            </div>
          </q-parallax>
        </div>
        <!-- Registration -->
        <div
          v-if="registrationState"
          class="col-md-4 col-12 column items-center q-pa-md animate__animated animate__fadeInDown"
          rounded
          style="background-color: #1b1b1b; border-radius: 15%; height: 50em"
        >
          <q-parallax :height="1500">
            <video
              autoplay
              height="1500"
              loop
              muted
              no-controls
              poster="http://thumb.multicastmedia.com/thumbs/aid/w/h/t1351705158/1571585.jpg"
              src="..//assets/f1opening.mp4"
              style="opacity: 0.5"
              width="1200"
            />
            <div class="column items-center absolute-center">
              <h4 style="color: white">Már van fiókja?</h4>
              <p style="color: white">Kérjük jelentkezzen be a folytatáshoz!</p>
              <q-btn
                class="vertical-middle q-mt-xl"
                color="black"
                label="Belépés"
                rounded
                @click="(loginState = true), (registrationState = false)"
              />
            </div>
          </q-parallax>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<style lang="scss"></style>
