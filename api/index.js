// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripeRoutes = require("./routes/stripeRoutes");

const app = express();

// Middleware CORS configurado correctamente
app.use(cors({
  origin: "https://murirami.netlify.app", // Permite el frontend en Netlify
  methods: ["GET", "POST"], // Métodos permitidos
  allowedHeaders: ["Content-Type"] // Cabeceras permitidas
}));

app.use(express.json());
app.use("/api/stripe", stripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
