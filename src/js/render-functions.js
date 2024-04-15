import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let lightbox; 

function preloadImages(images) {
    return new Promise((resolve, reject) => {
    const imagePromises = images.map(image => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = error => reject(error);
            img.src = image.largeImageURL;
        });
    });

    Promise.all(imagePromises)
        .then(() => resolve())
        .catch(error => reject(error));
});

}

export function renderImages(images) {
    showLoader();
    preloadImages(images)
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

export function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) {
        loader.style.display = "none";
    }
}

export function moveLoaderBelowButton(button) {
    const loader = document.querySelector(".loader");
    loader.style.position = "absolute";
    loader.style.top = button.offsetTop + button.offsetHeight + "px";
    loader.style.left = button.offsetLeft + "px";
}

export function moveLoaderBelowInput(input) {
    const loader = document.querySelector(".loader");
    loader.style.position = "absolute";
    loader.style.top = input.offsetTop + input.offsetHeight + "px";
    loader.style.left = input.offsetLeft + "px";
}

