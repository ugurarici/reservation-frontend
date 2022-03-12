<template>
  <div>Admin reservations {{ reservations.data.length }}</div>
</template>

<script>
import axios from "../../api";

export default {
  data() {
    return {
      reservations: { data: [] },
    };
  },
  methods: {
    fetchAllReservations() {
      this.loading = true;
      axios
        .get("reservations")
        .then((response) => {
          this.reservations = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$store.commit("addError", error.message);
          this.loading = false;
        });
    },
  },
  beforeMount() {
    this.fetchAllReservations();
  },
};
</script>