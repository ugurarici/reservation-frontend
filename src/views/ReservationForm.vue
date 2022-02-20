<template>
  <div>
    <v-container>
      <v-card :loading="loading" max-width="350">
        <template slot="progress">
          <v-progress-linear
            color="primary"
            height="10"
            indeterminate
            absolute
          ></v-progress-linear>
        </template>

        <v-card-title>Reservation</v-card-title>

        <v-card-text>
          <v-text-field
            prepend-icon="mdi-account"
            label="Name Surname"
            hide-details="auto"
            class="mb-4"
            v-model="name"
          ></v-text-field>

          <v-text-field
            prepend-icon="mdi-mail"
            label="E-Mail"
            hide-details="auto"
            class="my-4"
            v-model="email"
          ></v-text-field>

          <v-text-field
            prepend-icon="mdi-phone"
            label="Phone"
            hide-details="auto"
            class="my-4"
            v-model="phone"
          ></v-text-field>

          <v-menu
            v-model="datePickerContainer"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
            class="my-4"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Select date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @input="datePickerContainer = false"
              :min="mindate"
            ></v-date-picker>
          </v-menu>

          <v-chip-group
            class="my-4"
            v-model="selectedHour"
            active-class="primary accent-4 white--text"
            column
          >
            <v-chip v-for="(hour, key) in availableHours" :key="key">{{
              hour
            }}</v-chip>
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" text @click="createReservation">
            Reserve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mindate: new Date().toISOString(),
      date: new Date(Date.now()).toISOString().substr(0, 10),
      datePickerContainer: false,
      name: null,
      time: null,
      email: null,
      phone: null,
      loading: false,
      hours: [],
      selectedHour: 0,
    };
  },
  methods: {
    fetchAvailableHoursOfDate() {
      this.selectedHour = 0;
      this.loading = true;
      axios
        .get("http://localhost/api/reservations/create?date=" + this.date)
        .then((response) => {
          this.hours = response.data;
          this.loading = false;
        });
    },
    createReservation() {
      this.loading = true;
      axios
        .post("http://localhost/api/reservations", {
          name: this.name,
          email: this.email,
          phone: this.phone,
          reservation_at: this.datetime,
        })
        .then((response) => {
          console.log(response.data);
          this.name = null;
          this.email = null;
          this.phone = null;
          this.selectedHour = 0;
          this.fetchAvailableHoursOfDate();
          this.loading = false;
          alert("Reservation succeded");
        })
        .catch((error) => {
          console.error(error);
          console.log(error.response.data.message);
          this.loading = false;
          alert("Try again :( \n" + error.response.data.message);
        });
    },
  },
  computed: {
    availableHours() {
      return this.hours.map((hour) => hour + ":00");
    },
    datetime() {
      return this.date + " " + this.availableHours[this.selectedHour] + ":00";
    },
  },
  beforeMount() {
    this.fetchAvailableHoursOfDate();
  },
  watch: {
    date() {
      this.hours = [];
      this.fetchAvailableHoursOfDate();
    },
  },
};
</script>