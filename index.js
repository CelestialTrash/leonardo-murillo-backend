// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripeRoutes = require("./routes/stripeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta para los pagos
app.use("/api/stripe", stripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
