import axios from "axios";

export async function fetchImages(query) {
    return axios.get(`https://pixabay.com/api/?${query}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error while fetching images:", error);
            throw error;
        });
}
