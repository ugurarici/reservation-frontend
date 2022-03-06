<template>
  <div>
    <v-container>
      <v-alert type="success" v-if="reservationSucceded">
        Reservation succeded!<br />
        Your reservation is {{ lastReservation.reservation_at.fromNow() }}
      </v-alert>

      <v-row>
        <v-col cols="12" sm="4">
          <v-card :loading="loading">
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

              <!-- TODO: Show a warning if selected date does not have any available reservation hours -->
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
        </v-col>

        <v-col cols="12" sm="8"> listesi </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "../api";

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
      reservationSucceded: false,
      lastReservation: null,
    };
  },
  methods: {
    fetchAvailableHoursOfDate() {
      this.selectedHour = 0;
      this.loading = true;
      axios
        .get("reservations/create?date=" + this.date)
        .then((response) => {
          this.hours = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$store.commit("addError", error.message);
          this.loading = false;
        });
    },
    createReservation() {
      this.loading = true;
      axios
        .post("reservations", {
          name: this.name,
          email: this.email,
          phone: this.phone,
          reservation_at: this.datetime,
        })
        .then((response) => {
          this.lastReservation = response.data;
          this.name = null;
          this.email = null;
          this.phone = null;
          this.selectedHour = 0;
          this.fetchAvailableHoursOfDate();
          this.loading = false;
          this.reservationSucceded = true;
        })
        .catch((error) => {
          this.loading = false;
          if (error.response) {
            this.$store.commit(
              "addError",
              "Try again :( \n" + error.response.data.message
            );
          } else {
            this.$store.commit("addError", error.message);
          }
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