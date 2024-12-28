"use client";

import React, { useState } from "react";
import axios from "axios";

export default function BreastCancerMammogram() {
  const [modelDeployment, setModelDeployment] = useState("random-forest-1");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Function to handle image upload and convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64String = reader.result.split(",")[1]; // Extract Base64 content
          setImageFile(file);

          // Automatically send the payload to the API once the image is processed
          const payload = {
            data: base64String,
          };
          await sendPayload(payload);
        } catch (err) {
          setError("Error processing the image. Please try again.");
          console.error(err);
        }
      };

      reader.onerror = () => {
        setError("Error reading the file. Please try again.");
        console.error("Error reading the file");
      };

      reader.readAsDataURL(file); // Read file as Base64
    }
  };

  // Function to send the payload to the API
  const sendPayload = async (payload) => {
    try {
      const url = "/api/proxy";

      const headers = {
        "Content-Type": "application/json",
        "azureml-model-deployment": modelDeployment,
      };

      const res = await axios.post(url, payload, { headers });
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setResponse(null);
      setError(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Breast Cancer Detection</h1>
      <p className="description">
        Breast cancer detection involves analyzing mammogram images to identify
        whether a tumor is benign (non-cancerous) or malignant (cancerous).
        Machine learning models trained on thousands of mammograms assist in
        detecting abnormalities with high accuracy. Upload a mammogram below to
        get a prediction.
      </p>

      {/* Image Upload Section */}
      <div className="upload-section">
        <label className="label">Upload Mammogram Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
        {imageFile && <p>Selected File: {imageFile.name}</p>}
      </div>

      {/* Model Deployment Name */}
      <div className="field">
        <label className="label">Model Deployment Name</label>
        <input
          type="text"
          value={modelDeployment}
          onChange={(e) => setModelDeployment(e.target.value)}
          required
          className="input"
        />
      </div>

      {/* Response Section */}
      {response && (
        <div className="response">
          <h3 className="response-title">Prediction Result</h3>
          <pre className="response-content">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {/* Error Section */}
      {error && (
        <div className="error">
          <h3 className="error-title">Error</h3>
          <pre className="error-content">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
