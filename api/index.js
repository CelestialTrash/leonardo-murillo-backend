// index.js
console.log("Server is starting...");

const express = require("express");
const cors = require("cors");
require('dotenv').config(); // Load environment variables
const stripeRoutes = require("./routes/stripeRoutes"); // Import routes

const app = express();


app.use(cors({ origin: "https://murirami.netlify.app" }));;
app.use(express.json()); // Middleware to parse JSON bodies

// Set up Stripe payment routes
app.use("/api/stripe", stripeRoutes);

module.exports = app; // Export the app for Vercel
