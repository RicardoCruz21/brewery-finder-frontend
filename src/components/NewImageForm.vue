<template>
  <div class="container">
    <form v-on:submit.prevent="onUpload">
      <img class="image-preview" v-bind:src="image" alt="placeholder" />
      <input
        type="file"
        v-on:change="onImageSelected"
        accept="image/jpeg, image/png, image/jpg"
      />
      <button>Upload</button>
      <p>{{ successMessage }}</p>
      <p>{{ errorMessage }}</p>
      <p>New Image Id: {{ newImageId }}</p>
    </form>
    <form v-on:submit.prevent="getImage">
      <img class="image-preview" v-bind:src="newImage" alt="placeholder2" />
      <input type="number" v-model="imageId" />
      <button>Get New Image</button>
    </form>
  </div>
</template>

<script>
import imageService from "../services/ImageService.js";

export default {
  name: "new-image-form",
  data() {
    return {
      image: "",
      newImage: "",
      imageId: 0,
      newImageId: 0,
      selectedImage: null,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    onImageSelected(event) {
      this.selectedImage = event.target.files[0];
      this.image = URL.createObjectURL(this.selectedImage);
    },
    onUpload() {
      const data = new FormData();
      data.append(
        "multipartImage",
        this.selectedImage,
        this.selectedImage.name
      );
      imageService
        .create(data)
        .then((response) => {
          if (response.status === 200) {
            this.newImageId = response.data;
            this.successMessage = "Image upload successful!";
          }
        })
        .catch((error) => {
          if (error.response) {
            this.errorMessage = `${error.response.status}: ${error.response.data.error}, ${error.response.data.message}`;
          }
        });
    },
    getImage() {
      imageService.get(this.imageId).then((response) => {
        if (response.status === 200) {
          this.newImage = `data:${response.data.type};base64,${response.data.content}`;
        }
      });
    },
  },
};
</script>

<style scoped>
.image-preview {
  width: 400px;
  height: auto;
  background-color: dodgerblue;
}
</style>
