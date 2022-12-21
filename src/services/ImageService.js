import axios from "axios";

export default {
  list() {
    return axios.get("/images");
  },

  get(id) {
    return axios.get(`/images/${id}`);
  },

  create(image) {
    return axios.post("/images", image);
  },

  update(id, image) {
    return axios.put(`/breweries/${id}`, image);
  },
};
