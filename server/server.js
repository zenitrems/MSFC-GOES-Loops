import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { JSDOM } from "jsdom";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors()); // Allow frontEnd queries

// Serve frontend static files from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..")));

//Rute
app.get("/proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("400");
    console.debug(req.path, req.host, url);

    // Obtener el HTML del CGI remoto
    const response = await fetch(url);
    const html = await response.text();

    // Extraer la URL del <img src="...">
    const dom = new JSDOM(html);
    const img = dom.window.document.querySelector("img");

    if (!img) return res.status(404).send("No image found");

    const imgSrc = img.getAttribute("src");
    const fullURL = new URL(imgSrc, url).href;

    res.json({ imageUrl: fullURL });

  } catch (error) {
    console.error(error);
    res.status(500).send("Image fetch error");
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Proxy on http://localhost:${PORT}`)
);
