<template>
  <div class="update-beer-page">
    <navigation></navigation>
    <update-beer-form></update-beer-form>
  </div>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import UpdateBeerForm from "../components/UpdateBeerForm.vue";

export default {
  name: "update-beer",
  components: {
    Navigation,
    UpdateBeerForm,
  },
};
</script>

<style scoped>
.update-beer-page {
  background-color: hsl(13, 100%, 72%);
}
</style>
