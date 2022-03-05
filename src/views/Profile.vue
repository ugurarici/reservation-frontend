<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-actions>
        <v-btn color="red" text to="/logout"> Logout </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null,
    };
  },
  beforeMount() {
    axios
      .get("http://localhost/api/me")
      .then((response) => (this.user = response.data));
  },
};
</script>