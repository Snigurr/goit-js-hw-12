
import axios from "axios";

export async function fetchImages(query) {
    try {
        const response = await axios.get(`https://pixabay.com/api/?${query}`);
        return response.data;
    } catch (error) {
        console.error("Error while fetching images:", error);
        throw error;
    }
}