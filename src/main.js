import { fetchImages } from "./js/pixabay-api.js";
import { renderImages, clearImages, moveLoaderBelowList, moveLoaderBelowInput } from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("search-form");
    const searchInput = document.getElementById("search-img");
    const addImageButton = document.querySelector(".add_img_btn");
    const API_KEY = "43273771-9fb27172998fac0872066584a";

    let currentPage = 1;
    let query;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        query = searchInput.value.trim();
        if (query) {
            currentPage = 1;
            try {
                await clearImages();
                moveLoaderBelowInput(searchInput);
                await fetchAllImages(query);
            } catch (error) {
                handleFetchError(error);
            }
        } else {
            iziToast.warning({
                title: "Warning",
                message: "Please enter a search query.",
                position: "topRight"
            });
        }
    });

    async function fetchAllImages(query) {
        searchInput.value = "";
        const params = new URLSearchParams({
            key: API_KEY,
            q: query,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            page: currentPage,
            per_page: 15
        });
        try {
            const data = await fetchImages(params);
            if (data.hits.length === 0) {
                clearImages();
                throw new Error("Sorry, there are no images matching your search query. Please try again!");
            }
            renderImages(data.hits, currentPage);
        } catch (error) {
            throw error;
        }
    }

    addImageButton.addEventListener("click", async () => {
        moveLoaderBelowList();
        try {
            await onLoadMoreImages();
        } catch (error) {
            handleFetchError(error);
        }
    });

    async function onLoadMoreImages() {
        currentPage++;
        try {
            await fetchAllImages(query);
        } catch (error) {
            throw error;
        }
    }

    function handleFetchError(error) {
        console.error(error);
        iziToast.error({
            message: 'An error occurred while fetching images. Please try again later.',
            position: 'topRight',
        });
    }
});
