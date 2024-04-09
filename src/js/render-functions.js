import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox; 

function preloadImages(images) {
    return new Promise((resolve, reject) => {
        const imagePromises = images.map(image => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = image.largeImageURL;
            });
        });

        Promise.all(imagePromises)
            .then(resolve)
            .catch(reject);
    });
}

export function renderImages(images) {
    showLoader();
    clearImages()
        .then(() => preloadImages(images))
        .then(() => {
            const list = document.querySelector("ul");
            if (!list) {
                throw new Error("List element not found");
            }
            list.insertAdjacentHTML("beforeend", createMarkup(images));
            if (!lightbox) {
                lightbox = new SimpleLightbox("ul a", {
                    captionsData: "alt",
                    captionDelay: 250,
                });
            } else {
                lightbox.refresh();
            }

            hideLoader();
        })
        .catch(error => {
            console.error("Error while preloading images:", error);
        });
}

export function clearImages() {
    return new Promise(resolve => {
        const list = document.querySelector("ul");
        if (list) {
            list.innerHTML = "";
        }
        resolve();
    });
}

function createMarkup(arr) {
    return arr
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
            <li>
                <a href="${largeImageURL}" alt="${tags}">
                    <img src="${webformatURL}" alt="${tags}" width="360" />
                    <p class="image-info">
                        <span>Likes<br> ${likes}</span>
                        <span>Views<br> ${views}</span>
                        <span>Comments<br> ${comments}</span>
                        <span>Downloads<br> ${downloads}</span>
                    </p>
                </a>
            </li>
        `)
        .join("");
}

export function showLoader() {
    const loader = document.querySelector(".loader");
    if (loader) {
        loader.style.display = "block";
    }
}

function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) {
        loader.style.display = "none";
    }
}
