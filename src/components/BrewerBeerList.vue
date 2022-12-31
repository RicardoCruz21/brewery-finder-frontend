<template>
  <div class="brewer-beer-list">
    <h1>Manage Beers</h1>
    <div class="add-btn-container">
      <button class="btn blue" v-on:click="addBeer">Add a Beer</button>
    </div>
    <div class="beer-card-list">
      <div v-if="emptyBeers">
        <div
          class="beer-card"
          v-for="beer in this.$store.state.brewerBeers"
          v-bind:key="beer.beerId"
          v-bind:class="{ inactive: !beer.active }"
        >
          <img
            v-bind:src="imagelink + beer.beerImage"
            v-bind:alt="beer.beerName"
            v-on:click="viewBeer(beer.beerId)"
          />
          <div class="beer-and-rating">
            <router-link
              v-bind:to="{ name: 'beers', params: { id: beer.beerId } }"
              >{{ beer.beerName }}</router-link
            >
            <p>
              Avg Rating:
              <span v-if="beer.averageRating">{{ beer.averageRating }}/5</span
              ><span v-else>No ratings available</span>
            </p>
          </div>
          <div class="btn-container">
            <button class="btn green" v-on:click="viewBeer(beer.beerId)">
              View
            </button>
            <button class="btn purple" v-on:click="updateBeer(beer.beerId)">
              Update
            </button>
            <button
              class="btn orange"
              v-show="beer.active"
              v-on:click="toggleActive(beer)"
            >
              Active
            </button>
            <button
              class="btn yellow"
              v-show="!beer.active"
              v-on:click="toggleActive(beer)"
            >
              Inactive
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="no-beers">
          <h2>No Beers Added Yet</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import beerService from "../services/BeerService.js";

export default {
  name: "brewer-beer-list",
  data() {
    return {
      beers: [],
      imagelink: `${
        process.env.VUE_APP_REMOTE_API_PROD ||
        process.env.VUE_APP_REMOTE_API_DEV
      }/images/`,
      errorMessage: "",
      successMessage: "",
    };
  },
  computed: {
    emptyBeers() {
      return this.beers.length;
    },
  },
  methods: {
    getBrewerBeers() {
      beerService
        .listAll(this.$store.state.breweryId)
        .then((response) => {
          if (response.status === 200) {
            this.$store.commit("SET_BREWER_BEERS", response.data);
            this.beers = response.data;
          }
        })
        .catch((error) => {
          if (error.response) {
            this.errorMessage = `${error.response.status}: ${error.response.data.error}, ${error.response.data.message}`;
          } else if (error.request) {
            this.errorMessage = "Server could not be reached.";
          } else {
            this.errorMessage = "Request could not be created.";
          }
        });
    },
    toggleActive(beer) {
      beer.active = !beer.active;
      beerService
        .delete(beer.beerId)
        .then((response) => {
          if (response.status === 200) {
            this.successMessage = "Beer update successful";
          }
        })
        .catch((error) => {
          if (error.response) {
            this.errorMessage = `${error.response.status}: ${error.response.data.error}, ${error.response.data.message}`;
          } else if (error.request) {
            this.errorMessage = "Server could not be reached.";
          } else {
            this.errorMessage = "Request could not be created.";
          }
        });
    },
    viewBeer(beerId) {
      this.$router.push({ name: "beers", params: { id: beerId } });
    },
    updateBeer(beerId) {
      this.$router.push({ name: "updateBeer", params: { id: beerId } });
    },
    addBeer() {
      this.$router.push({ name: "addBeer" });
    },
  },
  created() {
    this.getBrewerBeers();
  },
};
</script>

<style scoped>
.brewer-beer-list {
  font-family: Ubuntu, sans-serif;
  width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
h1 {
  font-size: 80px;
  background-color: hsl(207, 13%, 34%);
  color: hsl(0, 0%, 100%);
  text-align: center;
  border-radius: 16px;
}
h2 {
  font-size: 32px;
  color: hsl(207, 13%, 34%);
}
.add-btn-container {
  width: 1024px;
  margin: 24px auto 0 auto;
  display: flex;
  justify-content: flex-end;
}
.beer-card-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.beer-card {
  width: 1024px;
  height: 256px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsl(0, 0%, 100%);
  text-align: center;
  border-radius: 16px;
  padding: 8px 16px;
  margin: 24px 0;
  box-shadow: 4px 8px 8px rgb(90, 90, 90);
}
.no-beers {
  width: 1024px;
  height: 256px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: hsl(0, 0%, 100%);
  text-align: center;
  border-radius: 16px;
  padding: 8px 16px;
  margin: 24px 0;
  box-shadow: 4px 8px 8px rgb(90, 90, 90);
}
img {
  width: 240px;
  height: 240px;
  border-radius: 16px;
}
img:hover {
  cursor: pointer;
}
a {
  text-decoration: none;
  font-size: 32px;
  color: hsl(208, 49%, 24%);
}
.btn {
  width: 96px;
  height: 48px;
  font-size: 16px;
  color: hsl(0, 0%, 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn-container {
  width: 208px;
  display: flex;
  justify-content: space-around;
}
.blue {
  background-color: #0d6efd;
}
.green {
  background-color: #198754;
}
.orange {
  background-color: #fd7e14;
}
.yellow {
  background-color: #ffc107;
}
.purple {
  background-color: #6610f2;
}
.inactive {
  background-color: hsl(240, 2%, 79%);
}
</style>
