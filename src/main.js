import { fetchImages } from "./js/pixabay-api.js";
import { renderImages, showLoader, clearImages } from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("search-form");
    const searchInput = document.getElementById("search-img");
    const API_KEY = "43273771-9fb27172998fac0872066584a";

    form.addEventListener("submit", event => {
        event.preventDefault(); 

        const query = searchInput.value.trim();
        if (query) {
            const params = new URLSearchParams({
                key: API_KEY,
                q: query,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: "true"
            });
            fetchImages(params)
                .then(data => {
                    if (data.hits.length === 0) {
                        clearImages(); 
                        showLoader(); 
                        throw new Error("Sorry, there are no images matching your search query. Please try again!");
                    }
                    renderImages(data.hits, "ul.gallery");
                    searchInput.value = "";
                })
                .catch(error => {
                    searchInput.value = "";
                    iziToast.error({
                        title: "Error",
                        message: error.message,
                        position: "topRight"
                    });
                });
        } else {
            iziToast.warning({
                title: "Warning",
                message: "Please enter a search query.",
                position: "topRight"
            });
        }
    });
});




