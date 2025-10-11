import { API_PATHS } from "./apiPath";

const uploadImage = async (imageFile) => {

    console.log("Starting image upload for file:", imageFile);
    const formData = new FormData();

    // Append the image file to the form data

    formData.append("file", imageFile);
    console.log("FormData created with file:", formData.get("file"));

    try {
        const uploadUrl = `http://localhost:8000${API_PATHS.IMAGE.UPLOAD_IMAGE}`;
        console.log("Making request to:", uploadUrl);
        
        // Get token for authorization
        const token = localStorage.getItem("token");
        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: headers
        });

        const data = await response.json();
        console.log("Upload response status:", response.status);
        console.log("Upload response data:", data);
        
        if (!response.ok) {
            throw new Error(`Upload failed: ${data.message || response.statusText}`);
        }

        return data; // Return the response data

    } catch (error) {

        console.error("Error uploading image:", error);
        throw error; // Rethrow the error for further handling

    }

};

export { uploadImage };



