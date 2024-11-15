const express = require("express");
const cors = require("cors");
require('dotenv').config();
const stripeRoutes = require("./routes/stripeRoutes");

const app = express();

// Configuración de CORS para permitir el frontend de Netlify
app.use(cors({
  origin: "https://murirami.netlify.app", // Asegúrate de reemplazar con tu dominio real si cambia
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/api/stripe", stripeRoutes);

module.exports = app;

