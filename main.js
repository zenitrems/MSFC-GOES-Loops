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

//Popular opciones Por Caracteristicas disponibles en goes_config.json
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

//Build Url
function generateLink() {
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

  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `${base}?${query}`;

  document.getElementById(
    "output"
  ).innerHTML = `<strong>URL:</strong><br><a href="${url}" target="_blank">${url}</a>`;
}

loadConfig();
