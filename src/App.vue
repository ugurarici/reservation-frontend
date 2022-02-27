<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />

        <v-btn to="/" class="ml-2" text>
          <v-icon>mdi-home</v-icon>
          <span class="ml-2">Home</span>
        </v-btn>
        <v-btn to="/about" class="ml-2" text>
          <v-icon>mdi-information</v-icon>
          <span class="ml-2">About</span>
        </v-btn>
        <v-btn to="/form" class="ml-2" text>
          <v-icon>mdi-calendar</v-icon>
          <span class="ml-2">Reservation</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn to="/profile" class="ml-2" text v-if="loggedInUser">
        <v-icon>mdi-account</v-icon>
        <span class="ml-2">{{ loggedInUser.name }}</span>
      </v-btn>

      <v-btn to="/logout" class="ml-2" text v-if="loggedInUser">
        <v-icon>mdi-account</v-icon>
        <span class="ml-2">Logout</span>
      </v-btn>

      <v-btn to="/register" class="ml-2" text v-if="!loggedInUser">
        <v-icon>mdi-account-plus</v-icon>
        <span class="ml-2">Register</span>
      </v-btn>

      <v-btn to="/login" class="ml-2" text v-if="!loggedInUser">
        <v-icon>mdi-account</v-icon>
        <span class="ml-2">Login</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-alert
          v-for="(error, key) in errors"
          :key="key"
          type="error"
          transition="scale-transition"
        >
          <v-row align="center">
            <v-col class="grow">
              {{ error }}
            </v-col>
            <v-col class="shrink">
              <v-btn @click.prevent="deleteError(key)">Dismiss</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-container>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",
  methods: {
    ...mapMutations(["deleteError"]),
  },
  computed: {
    ...mapState(["errors", "loggedInUser"]),
  },
};
</script>
