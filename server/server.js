import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { JSDOM } from "jsdom";

const app = express();
app.use(cors()); // Allow frontEnd queries

//Rute
app.get("/proxy", async (req, res) => {
  try {
    const { url } = req.query;
    console.debug(url);
    if (!url) return res.status(400).send("Falta el parámetro ?url=");

    // Obtener el HTML del CGI remoto
    const response = await fetch(url);
    const html = await response.text();

    console.debug(html);

    // Extraer la URL del <img src="...">
    const dom = new JSDOM(html);
    const img = dom.window.document.querySelector("img");

    if (!img) return res.status(404).send("No se encontró ninguna imagen");

    const imgSrc = img.getAttribute("src");
    const fullURL = new URL(imgSrc, url).href;

    // Puedes elegir entre:
    // 1) Devolver solo la URL JSON
    res.json({ imageUrl: fullURL });

    // 2) O redirigir directamente:
    // res.redirect(fullURL);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la imagen");
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor proxy corriendo en http://localhost:${PORT}`)
);
