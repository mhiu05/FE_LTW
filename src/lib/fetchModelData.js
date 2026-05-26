const BASE_URL = "https://qhvlls-5000.csb.app";

function getUrl(url) {
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

function fetchModel(url) {
  return fetch(getUrl(url), { credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
      }
      return res.json();
    });
}

function postModel(url, body) {
  return fetch(getUrl(url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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

function postFormData(url, formData) {
  return fetch(getUrl(url), {
    method: "POST",
    credentials: "include",
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
