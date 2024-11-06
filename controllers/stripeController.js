const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY_TEST);

exports.createCheckoutSession = async (req, res) => {
    try {
        const { cartItems } = req.body;

        console.log("Cart Items received from frontend:", cartItems); // Log para verificar los datos recibidos

        const lineItems = cartItems.map(item => ({
            
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                description: `Material: ${item.material}, Color: ${item.color}, Switch: ${item.switchType}`,
              },
              unit_amount: item.price,
            },
            quantity: item.quantity,
            
          }));
          console.log("Line Items sent to Stripe:", lineItems);

          

        console.log("Line Items sent to Stripe:", lineItems); // Log para verificar datos enviados a Stripe

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "https://tu-dominio.com/success",
            cancel_url: "https://tu-dominio.com/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creando sesión de Stripe:", error);
        res.status(500).json({ error: error.message });
    }
};
