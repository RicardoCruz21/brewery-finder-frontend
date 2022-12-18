<template>
  <div class="container">
    <h2>Current Selection</h2>
    <div class="beer-card-list">
      <beer-card
        v-for="beer in this.$store.state.beers"
        v-bind:key="beer.beerId"
        v-bind:beer="beer"
      ></beer-card>
    </div>
  </div>
</template>

<script>
import beerService from "../services/BeerService.js";
import BeerCard from "../components/BeerCard.vue";

export default {
  name: "beer-card-list",
  data() {
    return {
      errorMessage: "",
    };
  },
  components: {
    BeerCard,
  },
  methods: {
    getBeers() {
      beerService
        .listActive(this.$route.params.id)
        .then((response) => {
          if (response.status === 200) {
            this.$store.commit("SET_BEERS", response.data);
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
  },
  created() {
    this.getBeers();
  },
};
</script>

<style scoped>
.container {
  width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  font-family: Ubuntu, sans-serif;
}
h2 {
  font-size: 48px;
  background-color: hsl(207, 13%, 34%);
  color: hsl(0, 0%, 100%);
  text-align: center;
  border-radius: 16px;
}
.beer-card-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  justify-items: center;
  row-gap: 32px;
  margin: 32px 0;
}
</style>
