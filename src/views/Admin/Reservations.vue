<template>
  <v-container>
    <div>Admin reservations {{ reservations.data.length }}</div>
    <v-row>
      <v-col>
        <v-sheet :height="500">
          <v-calendar
            ref="calendar"
            :value="today"
            :events="calendarEvents"
            color="primary"
            type="week"
          >
            <template v-slot:day-body="{ date, week }">
              <div
                class="v-current-time"
                :class="{ first: date === week[0].date }"
                :style="{ top: nowY }"
              ></div>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "../../api";
import moment from "moment";

export default {
  data() {
    return {
      ready: false,
      reservations: { data: [] },
      today: moment().format("YYYY-MM-DD"),
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
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
  },
  mounted() {
    this.ready = true;
    this.fetchAllReservations();
    this.cal.scrollToTime("10:00");
    this.updateTime();
    console.log(this.cal.updateTimes);
  },
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
    reservationsToList() {
      return this.reservations.data.map((reservation) => {
        reservation.is_past = moment().isAfter(reservation.reservation_at);
        return reservation;
      });
    },
    calendarEvents() {
      return this.reservationsToList.map((reservation) => {
        let color = "primary";
        if (reservation.user_id) {
          color = "success";
        }
        if (reservation.is_past) {
          color = "grey darken-1";
        }
        return {
          name: reservation.name,
          start: reservation.reservation_at.format("YYYY-MM-DD HH:mm"),
          end: moment(reservation.reservation_at)
            .add(1, "h")
            .format("YYYY-MM-DD HH:mm"),
          color,
        };
      });
    },
  },
};
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>