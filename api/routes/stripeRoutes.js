const express = require("express");
const { createCheckoutSession } = require("../controllers/stripeController");

const router = express.Router();

// Ruta POST para crear sesiones de pago
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
