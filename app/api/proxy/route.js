import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await axios.post(
      `${process.env.END_POINT}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`, // API key from .env.local
          "azureml-model-deployment": req.headers.get("azureml-model-deployment"),
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.response?.data || "An error occurred.",
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
