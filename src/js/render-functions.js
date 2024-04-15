import SimpleLightbox from "simplelightbox";
    import iziToast from "izitoast";
    import "simplelightbox/dist/simple-lightbox.min.css";
    const addImageButton = document.querySelector(".add_img_btn");
    const list = document.querySelector("ul");
    const loader = document.querySelector(".loader");

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

    export function renderImages(images, page) {
        showLoader();
        preloadImages(images)
            .then(() => {
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
                if(page !== 1){
                    const height = (list.firstElementChild.getBoundingClientRect().height * 2) + 48;
                    setTimeout(() => {
                        window.scrollBy({
                            top: height,
                            behavior: 'smooth',
                        });
                    }, 300);
                }

                if(images.length < 15){
                    hideLoaderButton();
                    iziToast.warning({
                        title: "Warning",
                        message: "There are fewer than 15 images available.",
                        position: "topRight"
                    });
                }
                
            })
            .catch(error => {
                console.error("Error while preloading images:", error);
            });
    }



    export function clearImages() {
        hideLoader();
        hideLoaderButton();
        return new Promise(resolve => {
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

    function showLoader() {
        if (loader) {
            loader.style.display = "block";
            hideLoaderButton();
        }
    }

    function hideLoader() {
        if (loader) {
            loader.style.display = "none";
            addImageButton.style.display = "block";
        }
    }

    function hideLoaderButton(){
        addImageButton.style.display = "none";
    }

    export function moveLoaderBelowList() {
        loader.style.position = "absolute";
        loader.style.top = list.offsetTop + list.offsetHeight + "px";
}

export function moveLoaderBelowInput(input) {
        loader.style.position = "absolute";
        loader.style.top = input.offsetTop + input.offsetHeight + "px";
    }