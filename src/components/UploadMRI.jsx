import { useState } from "react";
import { predictMRI } from "../services/api"; // use the updated API function

export default function UploadMRI({ setResult }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // Upload MRI and get prediction
  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an MRI image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please login.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");

    try {
      // Use the updated API helper function
      const prediction = await predictMRI(formData);

      // Set the prediction for ResultCard to display
      setResult({
        class: prediction.class ?? "Unknown",
        confidence: prediction.confidence ?? null,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {preview && (
        <img
          src={preview}
          alt="MRI Preview"
          className="w-full h-auto rounded-xl border border-slate-300"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-xl file:border-0
                   file:text-sm file:font-semibold
                   file:bg-slate-100 file:text-slate-700
                   hover:file:bg-slate-200"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition"
      >
        {loading ? "Analyzing MRI..." : "Predict Alzheimer’s Stage"}
      </button>
    </div>
  );
}
