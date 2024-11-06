// index.js
console.log("Server is starting...");

const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const stripeRoutes = require("./routes/stripeRoutes"); // Import routes

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Set up Stripe payment routes
app.use("/api/stripe", stripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

