<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-text> Registered {{ user.created_at.fromNow() }} </v-card-text>
      <v-card-actions>
        <v-btn color="red" text to="/logout"> Logout </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "../api";

export default {
  data() {
    return {
      user: null,
    };
  },
  beforeMount() {
    axios.get("me").then((response) => {
      console.log(response.data);
      this.user = response.data;
    });
  },
};
</script>