import { fetchImages } from "./js/pixabay-api.js";
import { renderImages, showLoader, clearImages, hideLoader, moveLoaderBelowButton, moveLoaderBelowInput } from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";



document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("search-form");
    const searchInput = document.getElementById("search-img");
    const addImageButton = document.querySelector(".add_img_btn");
    const API_KEY = "43273771-9fb27172998fac0872066584a";
    

    let currentPage = 1;
    let query = '';



    form.addEventListener("submit", async event => {
        event.preventDefault();
        query = searchInput.value.trim();
        
        if (query) {
            
            currentPage = 1; 
            clearImages().then(() => {
                moveLoaderBelowInput(searchInput);
                showLoader();
                fetchAllImages(query);  
            });
        } else {
            iziToast.warning({
                title: "Warning",
                message: "Please enter a search query.",
                position: "topRight"
            });
        }
    });

    async function fetchAllImages() {
        const query = searchInput.value.trim();
        const params = new URLSearchParams({
            key: API_KEY,
            q: query,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            page: currentPage, 
            per_page: 15
        });
        fetchImages(params)
            .then(data => {
                if (data.hits.length === 0) {
                    clearImages();
                    showLoader();
                    throw new Error("Sorry, there are no images matching your search query. Please try again!");
                }
                renderImages(data.hits, "ul.gallery");
                
                if (data.hits.length < 15) {
                    hideLoadMoreButton();
                    iziToast.warning({
                        title: "Warning",
                        message: "There are fewer than 15 images available.",
                        position: "topRight"
                    });
            }
            })
            .catch(error => {
                searchInput.value = "";
                iziToast.error({
                    title: "Error",
                    message: error.message,
                    position: "topRight"
                });
            });
    }

    addImageButton.addEventListener("click", () => {
        showLoader();
        moveLoaderBelowButton(addImageButton);
        onLoadMoreImages();
    });

    async function onLoadMoreImages() {
        showLoader(); 
        currentPage++; 
        try {
            await fetchAllImages();
        } catch (error) {
            console.error(error);
            iziToast.error({
                message: 'An error occurred while fetching images. Please try again later.',
                position: 'topRight',
            });
        } finally {
            hideLoader();
        }
    }

    function hideLoadMoreButton() {
        addImageButton.style.display = "none";
    }
});
