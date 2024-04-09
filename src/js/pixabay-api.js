export function fetchImages(query) {
    const url = `https://pixabay.com/api/?${query}`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error while fetching images:", error);
            throw error; 
        });
}
