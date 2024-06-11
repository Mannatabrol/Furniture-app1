
// Define the URL of your backend deployed on Render
const backendUrl = "https://your-render-backend.onrender.com";

// Example function that makes a request to your backend
async function fetchDataFromBackend() {
    try {
        const response = await fetch(`${backendUrl}/api/data`);
        const data = await response.json();
        console.log("Data from backend:", data);
    } catch (error) {
        console.error("Error fetching data from backend:", error);
    }
}

// Call the function to fetch data from the backend
fetchDataFromBackend();
