import axios from "axios";

// -----------------------------
// Create Axios instance
// -----------------------------
const API = axios.create({
  baseURL: "https://srihealth-backend.onrender.com/", // FastAPI backend
  timeout: 10000, // 10s timeout
});

// -----------------------------
// Attach JWT automatically to all requests
// -----------------------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Generic API error handler
// -----------------------------
const handleError = (error) => {
  if (error.response && error.response.data) {
    console.error("API Error:", error.response.data);
    const detail =
      error.response.data.detail ||
      error.response.data.message ||
      JSON.stringify(error.response.data);
    throw new Error(detail);
  } else {
    console.error("API Error:", error.message);
    throw new Error(error.message);
  }
};

// -----------------------------
// Prediction API
// -----------------------------
/**
 * Upload MRI image and get prediction.
 * @param {FormData} formData - Contains "file" key with MRI image
 * @returns {Promise<{class: string, confidence: number|null}>}
 */
export const predictMRI = async (formData) => {
  try {
    const response = await API.post("/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // FastAPI now returns { class, confidence } directly
    if (response.data?.class) {
      return {
        class: response.data.class,
        confidence: response.data.confidence ?? null,
      };
    }

    throw new Error("Unexpected response from server.");
  } catch (error) {
    handleError(error);
  }
};

// -----------------------------
// Optional: Fetch previous predictions
// -----------------------------
export const fetchPredictions = async () => {
  try {
    const res = await API.get("/predictions"); // if endpoint exists
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export default API;
