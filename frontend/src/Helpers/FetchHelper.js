export async function fetchHelper(
  url,
  method = "GET",
  data = null,
  headers = {}
) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const options = {
    method,
    headers: defaultHeaders,
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}
