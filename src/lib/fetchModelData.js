const BASE_URL = "https://qhvlls-5000.csb.app";

function getUrl(url) {
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

function getAuthHeaders() {
  const token = localStorage.getItem("jwt_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET request
function fetchModel(url) {
  return fetch(getUrl(url), { headers: getAuthHeaders() })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
      }
      return res.json();
    });
}

// POST request
function postModel(url, body) {
  return fetch(getUrl(url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        throw new Error(data.error || `Request failed: ${res.status}`);
      });
    }
    return res.json();
  });
}

// POST request (images)
function postFormData(url, formData) {
  return fetch(getUrl(url), {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        throw new Error(data.error || `Upload failed: ${res.status}`);
      });
    }
    return res.json();
  });
}

export default fetchModel;
export { postModel, postFormData };
