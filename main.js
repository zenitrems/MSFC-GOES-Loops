//Load goes_config.json
async function loadConfig() {
  try {
    const response = await fetch("goes_config.json");
    const config = await response.json();

    populateSelect("satellite", config.satellites);
    populateSelect("band", config.bands);
    populateSelect("palette", config.palettes);
    populateSelect("mapcolor", config.mapcolors);
    populateSelect("zoom", config.zoom);
    populateSelect("type", config.types);
  } catch (e) {
    console.error("Error loading config:", e);
  }
}

//Load goes_config.json inputs
function populateSelect(id, data) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  data.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.textContent = item.label;
    select.appendChild(opt);
  });
}

//Build URL
let GEN_URL = ""; //Save Generated Url
function generateUrl() {
  const base = "https://weather.ndc.nasa.gov/cgi-bin/get-abi";
  const satellite = document.getElementById("satellite").value;

  const params = {
    satellite: `${satellite}${document.getElementById("band").value}`,
    palette: document.getElementById("palette").value,
    mapcolor: document.getElementById("mapcolor").value,
    zoom: document.getElementById("zoom").value,
    lat: document.getElementById("lat").value,
    lon: document.getElementById("lon").value,
    type: document.getElementById("type").value,
    numframes: document.getElementById("numframes").value,
    width: document.getElementById("width").value,
    height: document.getElementById("height").value,
    quality: document.getElementById("quality").value,
  };
  /* Join Parameters */
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `${base}?${query}`;

  GEN_URL = url;

  /* Inject Generated URL into the HTML */
  document.getElementById(
    "output"
  ).innerHTML = `<strong>URL:</strong><br><a href="${url}" target="_blank">${url}</a>`;

  document.getElementById("preview-button").hidden = false;
  //updatePreview(url);
}

/* Fetch Image from GOES */
async function updatePreview() {
  const preview = document.getElementById("preview");
  if (!preview) return;

  try {
    /* Encode URL */
    const u = new URL(GEN_URL);

    //Static Parameters

    u.searchParams.set("type", "Image");
    u.searchParams.set("width", "800");
    u.searchParams.set("height", "800");
    //u.searchParams.set("quality", "100");

    const previewUrl = u.toString();

    const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(
      previewUrl
    )}`;
    //query Localhost proxy
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`Error al obtener imagen: ${res.status}`);
    const data = await res.json();

    preview.src = data.imageUrl;
    //document.getElementById("image-box").hidden = false;
  } catch (err) {
    console.error("Error actualizando preview:", err);
  }
}

//Auto Refresh Preview Function
function autoRefreshPreview() {
  console.log("Auto-refresh function called");
  if (!GEN_URL) return; //If no URL generated, exit function
  if (!document.getElementById("auto-refresh").checked) return; //If not checked, exit function
  console.log("Auto-refresh enabled");
  setInterval(() => {
    updatePreview();
    console.log("Preview refreshed");
  }, 300000); //Refresh every 5 minutes
  console.log("Auto-refresh interval set");
}

//UTC Clock Function
function clockUTC() {
  const date = new Date();
  let dayUTC = date.getUTCDate().toString().padStart(2, "0");
  let monthUTC = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  let yearUTC = date.getUTCFullYear().toString().padStart(2, "0");

  let dateUTC = `${dayUTC}-${monthUTC}-${yearUTC}`;

  let hourUTC = date.getUTCHours().toString().padStart(2, "0");
  let minutesUTC = date.getUTCMinutes().toString().padStart(2, "0");
  let secondsUTC = date.getUTCSeconds().toString().padStart(2, "0");

  let timeUTC = `${hourUTC}:${minutesUTC} UTC`;

  let datetimeUTC = `${dateUTC} ${timeUTC}`;

  return datetimeUTC;
}
//Set UTC Clock in HTML
let val; //Global variable to store the interval ID
function setUTCClock() {
  const utcClock = document.getElementById("utcClock");

  val = setInterval(() => {
    utcClock.textContent = clockUTC();
  }, 1000); //Update every second
  console;
}

loadConfig();
setUTCClock();
