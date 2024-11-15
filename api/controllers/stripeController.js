const Stripe = require("stripe");

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY, // Cambiar manualmente entre TEST y LIVE
  { apiVersion: "2022-11-15" }
);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, formData } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const lineItems = cartItems.map((item) => {
      const unitAmount = Math.round(parseFloat(item.price) * 100); // Convertir a centavos

      if (isNaN(unitAmount) || unitAmount <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }

      console.log("Preparing line item:", {
        name: item.name,
        material: item.material,
        color: item.color,
        switchType: item.switchType,
        unitAmount,
      });

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} - ${item.material || 'N/A'}`, // Material en el nombre
            description: `Color: ${item.color || 'N/A'}, Switch: ${item.switchType || 'N/A'}`, // Descripción visible
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/success`, // Cambia localhost según el dominio en producción
      cancel_url: `http://localhost:5173/cancel`,  // Página integrada de cancelación de Stripe
    });

    console.log("Stripe session created:", session.id);

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
};
