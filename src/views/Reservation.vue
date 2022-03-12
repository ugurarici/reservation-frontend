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
              <!-- TODO: instead of running createReservation on click button, creat a form and trigger it on form submit -->
              <v-btn color="primary" text @click="createReservation">
                Reserve
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="8">
          <template v-if="loggedInUser">
            <v-card v-if="usersReservations.data.length > 0">
              <v-card-title>
                <v-icon left>mdi-calendar-clock</v-icon>
                Reservations
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="reservation in reservationsToList"
                    :key="reservation.id"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        :class="{ is_past: reservation.is_past }"
                      >
                        {{ reservation.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          reservation.reservation_at.format("DD.MM.YYYY HH:mm")
                        }}
                        -
                        {{ reservation.reservation_at.fromNow() }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="reservation.email">
                        {{ reservation.email }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="reservation.phone">
                        {{ reservation.phone }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action v-if="!reservation.is_past">
                      <v-list-item-action-text>
                        <v-btn
                          icon
                          color="error"
                          class="mr-2"
                          @click="deleteReservation(reservation.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </template>
          <template v-else>
            <v-card>
              <v-card-title>
                Register and follow up your reservations
              </v-card-title>
              <v-card-text>
                By registering you can check your past and future reservations.
              </v-card-text>
              <v-card-actions>
                <v-btn to="/register" color="primary">Register Now</v-btn>
                <v-btn to="/login" color="primary" text>Login</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "../api";
import { mapState } from "vuex";
import moment from "moment";

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
      usersReservations: { data: [] },
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
    fetchUsersReservations(page = 1) {
      this.loading = true;
      axios
        .get("reservations?page=" + page)
        .then((response) => {
          this.usersReservations = response.data;
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
          this.selectedHour = 0;
          this.fetchAvailableHoursOfDate();
          this.loading = false;
          this.reservationSucceded = true;
          if (this.loggedInUser) {
            this.fetchUsersReservations();
          } else {
            this.name = null;
            this.email = null;
            this.phone = null;
          }
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
    deleteReservation(id) {
      //  add a confirmation dialog
      if (confirm("Are you sure?")) {
        this.loading = true;
        axios
          .delete("reservations/" + id)
          .then(() => {
            this.loading = false;
            this.fetchAvailableHoursOfDate();
            if (this.loggedInUser) {
              this.fetchUsersReservations();
            }
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
      }
    },
  },
  computed: {
    ...mapState(["loggedInUser"]),
    availableHours() {
      return this.hours.map((hour) => hour + ":00");
    },
    datetime() {
      return this.date + " " + this.availableHours[this.selectedHour] + ":00";
    },
    reservationsToList() {
      return this.usersReservations.data.map((reservation) => {
        reservation.is_past = moment().isAfter(reservation.reservation_at);
        return reservation;
      });
    },
  },
  beforeMount() {
    this.fetchAvailableHoursOfDate();
    if (this.loggedInUser) {
      this.name = this.loggedInUser.name;
      this.email = this.loggedInUser.email;
      this.fetchUsersReservations();
    }
  },
  watch: {
    date() {
      this.hours = [];
      this.fetchAvailableHoursOfDate();
    },
  },
};
</script>

<style>
.is_past {
  opacity: 0.5;
  text-decoration: line-through;
}
</style>