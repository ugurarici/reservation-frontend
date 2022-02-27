<template>
  <div>Logout</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["logout"]),
  },
  beforeMount() {
    this.logout();
    this.$router.push("/");
  },
};
</script>