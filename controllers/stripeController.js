const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_TEST_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, formData } = req.body;

    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Material: ${item.material}, Color: ${item.color}, Switch: ${item.switchType}`,
        },
        unit_amount: item.price, // Precio en centavos
      },
      quantity: item.quantity,
    }));

    const metadata = cartItems.reduce((acc, item, index) => {
      acc[`product_${index + 1}`] = `Name: ${item.name}, Material: ${item.material}, Color: ${item.color}, Switch: ${item.switchType}`;
      return acc;
    }, {});

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: {
        customerName: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        ...metadata, // Incluye detalles del producto
      },
      success_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
};
