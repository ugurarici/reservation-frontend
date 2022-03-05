<template>
  <v-container>
    <v-form ref="form" @submit.prevent="login">
      <v-card :loading="loading" max-width="350">
        <template slot="progress">
          <v-progress-linear
            color="primary"
            height="10"
            indeterminate
            absolute
          ></v-progress-linear>
        </template>

        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            type="email"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn type="submit" color="primary" class="mr-4"> Login </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import axios from "../api";
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      email: null,
      password: null,
      loading: false,
    };
  },
  methods: {
    ...mapMutations(["setLoggedInUser", "addError"]),
    ...mapActions(["redirectAfterLogin"]),
    login() {
      this.loading = true;
      axios
        .post("login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.setLoggedInUser(response.data);
          this.redirectAfterLogin();
        })
        .catch((error) => {
          if (error.response) {
            this.addError(error.response.data.message);
          } else {
            this.addError(error.message);
          }
        })
        .then(() => {
          this.loading = false;
        });
    },
  },
};
</script>