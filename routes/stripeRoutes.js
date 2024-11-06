// routes/stripeRoutes.js
const express = require("express");
const { createCheckoutSession } = require("../controllers/stripeController"); // Import the controller function

const router = express.Router();

// Define the POST route for creating checkout sessions
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
