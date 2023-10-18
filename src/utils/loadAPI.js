import loadjs from "loadjs";

let mapsPromise = null;
function loadApi() {
  if (!mapsPromise) {
    const apiUrl = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places,maps`;
    mapsPromise = new Promise((resolve, reject) => {
      loadjs(apiUrl, {
        success: () => {
          resolve(window.google);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  return mapsPromise;
}

export default loadApi;
