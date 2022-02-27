<template>
  <v-container>
    <v-card>
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-actions>
        <v-btn color="red" text to="/logout"> Logout </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({ user: "loggedInUser" }),
  },
};
</script>