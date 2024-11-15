const Stripe = require("stripe");

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY, // Clave de Stripe segura
  { apiVersion: "2022-11-15" }
);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, formData } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const lineItems = cartItems.map((item) => {
      const unitAmount = Math.round(parseFloat(item.price) * 100); // Convierte a centavos

      if (isNaN(unitAmount) || unitAmount <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} - ${item.material || 'N/A'}`, // Material en el nombre
            description: `Color: ${item.color || 'N/A'}, Switch: ${item.switchType || 'N/A'}` // Descripción detallada
          },
          unit_amount: unitAmount
        },
        quantity: item.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://murirami.netlify.app/success`, // URL de éxito
      cancel_url: `https://murirami.netlify.app/cancel` // URL de cancelación
    });

    console.log("Stripe session created:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
};
