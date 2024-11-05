// controllers/stripeController.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    try {
        const { cartItems } = req.body;

        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    description: `Material: ${item.material}, Color: ${item.color}, Switch: ${item.switchType}`,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "https://tu-dominio.com/success",
            cancel_url: "https://tu-dominio.com/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
