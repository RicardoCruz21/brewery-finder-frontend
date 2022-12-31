<template>
  <div class="container">
    <h1>Update Beer</h1>
    <form class="form-card" v-on:submit.prevent="updateEntireBeer">
      <h2>Beer Information</h2>
      <div class="data-inputs">
        <label for="name">Beer Name</label>
        <input type="text" class="form-control" v-model="beerName" required />
      </div>
      <div class="data-inputs">
        <label for="type">Beer Type</label>
        <input type="text" class="form-control" v-model="beerType" required />
      </div>
      <div class="data-inputs">
        <label for="abv">Beer ABV</label>
        <input
          type="number"
          class="form-control"
          step="0.1"
          v-model="beerAbv"
          required
        />
      </div>
      <div class="data-inputs">
        <label for="beerImage">Beer Image</label>
        <img
          class="beer-image-preview"
          v-bind:src="beerImagePreview"
          v-bind:alt="beerName + ' image'"
        />
        <input
          type="file"
          class="form-control"
          v-on:change="onImageSelected"
          accept="image/*"
        />
      </div>
      <!-- <div class="data-inputs">
        <label for="imageLink">Beer Image Link</label>
        <input type="text" class="form-control" v-model="beerImage" required />
      </div> -->
      <div class="data-inputs">
        <label for="description">Beer Description</label>
        <textarea
          name="description"
          class="text-area"
          cols="30"
          rows="8"
          v-model.lazy="beerDescription"
        ></textarea>
      </div>
      <div class="data-inputs">
        <label for="active">Beer Status</label>
        <div class="active-status">
          <input class="checkbox" type="checkbox" v-model="active" />
          <span v-show="active">Active</span>
          <span v-show="!active">Inactive</span>
        </div>
      </div>
      <div class="btn-container">
        <button class="btn blue">Update</button>
        <button class="btn red" type="button" v-on:click="goBack">
          Cancel
        </button>
      </div>
      <p class="success" v-show="updateSuccess">{{ successMessage }}</p>
      <p class="failure" v-show="updateFailure">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import beerService from "../services/BeerService.js";
import imageService from "../services/ImageService.js";

export default {
  name: "update-beer-form",
  data() {
    return {
      beerId: 0,
      breweryId: 0,
      beerName: "",
      beerType: "",
      beerAbv: 0.0,
      beerImage: 0,
      beerDescription: "",
      active: false,
      updateSuccess: false,
      updateFailure: false,
      errorMessage: "",
      successMessage: "Update successful!",
      newBeerImage: null,
      beerImagePreview: "",
      isBeerImageChanged: false,
    };
  },
  methods: {
    getBeer() {
      beerService
        .get(this.$route.params.id)
        .then((response) => {
          if (response.status === 200) {
            this.beerId = response.data.beerId;
            this.breweryId = response.data.breweryId;
            this.beerName = response.data.beerName;
            this.beerType = response.data.beerType;
            this.beerAbv = response.data.beerAbv;
            this.beerImage = response.data.beerImage;
            this.beerDescription = response.data.beerDescription;
            this.active = response.data.active;
            this.beerImagePreview = `${
              process.env.VUE_APP_REMOTE_API_PROD ||
              process.env.VUE_APP_REMOTE_API_DEV
            }/images/${response.data.beerImage}`;
          }
        })
        .catch((error) => {
          if (error.response) {
            this.errorMessage = `${error.response.status}: ${error.response.data.error}, ${error.response.data.message}`;
          } else if (error.request) {
            this.errorMessage =
              "Error submitting form. Server could not be reached.";
          } else {
            this.errorMessage =
              "Error submitting form. Request could not be created.";
          }
        });
    },
    onImageSelected(event) {
      this.newBeerImage = event.target.files[0];
      this.beerImagePreview = URL.createObjectURL(this.newBeerImage);
      this.isBeerImageChanged = true;
    },
    updateImage(id, newImage) {
      return new Promise((resolve, reject) => {
        const data = new FormData();
        data.append("multipartImage", newImage, newImage.name);

        imageService.update(id, data).then((response) => {
          if (response.status === 200) {
            resolve(
              `${
                process.env.VUE_APP_REMOTE_API_PROD ||
                process.env.VUE_APP_REMOTE_API_DEV
              }/images/${response.data}`
            );
          } else {
            reject(new Error(`Could not update image ${newImage.name}`));
          }
        });
      });
    },
    updateBeer() {
      const beer = {
        beerId: this.beerId,
        breweryId: this.breweryId,
        beerName: this.beerName,
        beerType: this.beerType,
        beerAbv: this.beerAbv,
        beerImage: this.beerImage,
        beerDescription: this.beerDescription,
        active: this.active,
      };
      beerService
        .update(beer.beerId, beer)
        .then((response) => {
          if (response.status === 200) {
            this.updateSuccess = true;
          }
        })
        .catch((error) => {
          if (error.response) {
            this.errorMessage = `${error.response.status}: ${error.response.data.error}, ${error.response.data.message}`;
          } else if (error.request) {
            this.errorMessage =
              "Error submitting form. Server could not be reached.";
          } else {
            this.errorMessage =
              "Error submitting form. Request could not be created.";
          }
          this.updateFailure = true;
        });
    },
    updateEntireBeer() {
      if (this.isBeerImageChanged) {
        this.updateImage(this.beerImage, this.newBeerImage).then((response) => {
          //console.log(response);
          this.updateBeer();
        });
      } else {
        this.updateBeer();
      }
    },
    goBack() {
      this.$router.push({ name: "manageBeers" });
    },
  },
  created() {
    this.getBeer();
  },
};
</script>

<style scoped>
.container {
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
  color: hsl(208, 49%, 24%);
  margin-bottom: 8px;
}
.form-card {
  width: 512px;
  margin: 24px auto 0 auto;
  display: flex;
  flex-direction: column;
  background-color: hsl(0, 0%, 100%);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 4px 8px 8px rgb(90, 90, 90);
  margin-bottom: 24px;
}
.data-inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.data-inputs > label {
  font-size: 18px;
  color: hsl(208, 49%, 24%);
  padding: 8px 0;
}
.form-control {
  height: 32px;
  font-size: 16px;
  border: 1px solid hsl(208, 49%, 24%);
  padding-left: 8px;
}
.text-area {
  font-size: 16px;
  border: 1px solid hsl(208, 49%, 24%);
  padding: 8px;
}
.checkbox {
  margin-right: 8px;
}
.beer-image-preview {
  width: 256px;
}
.btn-container {
  width: 256px;
  display: flex;
  justify-content: space-evenly;
}
.btn {
  width: 96px;
  height: 48px;
  font-size: 16px;
  color: hsl(0, 0%, 100%);
  padding: 0 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 16px;
}
.blue {
  background-color: #0d6efd;
}
.red {
  background-color: #dc3545;
}
</style>
