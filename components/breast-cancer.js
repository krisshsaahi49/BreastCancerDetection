"use client";

import React, { useState } from "react";
import axios from "axios";

export default function BreastCancerApi() {
  const [modelDeployment, setModelDeployment] = useState("random-forest-1");
  const [inputData, setInputData] = useState("{}");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = "/api/proxy";

      const headers = {
        "Content-Type": "application/json",
        "azureml-model-deployment": modelDeployment,
      };

      const res = await axios.post(url, JSON.parse(inputData), { headers });
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
      <form onSubmit={handleSubmit} className="form">
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
        <div className="field">
          <label className="label">Input Data (JSON)</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={5}
            required
            className="textarea"
          ></textarea>
        </div>
        <button type="submit" className="button">
          Submit
        </button>
      </form>

      {response && (
        <div className="response">
          <h3 className="response-title">Response</h3>
          <pre className="response-content">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="error">
          <h3 className="error-title">Error</h3>
          <pre className="error-content">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
