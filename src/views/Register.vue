<template>
  <v-container>
    <v-form ref="form" @submit.prevent="register">
      <v-text-field v-model="name" label="Name" required></v-text-field>

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

      <v-text-field
        v-model="password_confirmation"
        label="Password (confirmation)"
        type="password"
        required
      ></v-text-field>

      <v-btn type="submit" color="primary" class="mr-4"> Register </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: null,
      email: null,
      password: null,
      password_confirmation: null,
    };
  },

  methods: {
    register() {
      axios
        .post("http://localhost/api/register", {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        })
        .then((response) => {
          console.log(response);
          console.log(response.data.token);
          this.$store.commit("setLoggedInUser", response.data);
          this.$router.push("/");
        })
        .catch((error) => alert(error.message));
    },
  },
};
</script>