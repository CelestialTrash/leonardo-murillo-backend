// controllers/stripeController.js
const Stripe = require("stripe");
const nodemailer = require("nodemailer");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

async function sendEmail(customerEmail, paymentId) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: 'Order Confirmation',
    text: `Thank you for your order! Your payment ID is: ${paymentId}. You can use this ID to track your order.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, formData } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!formData.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.name} - ${item.material || 'N/A'}`,
          description: `Color: ${item.color || 'N/A'}, Switch: ${item.switchType || 'N/A'}`,
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://murirami.netlify.app/success`,
      cancel_url: `https://murirami.netlify.app/cancel`,
    });

    // Retrieve Payment Intent to get the Payment ID
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    // Send the Payment ID via email
    await sendEmail(formData.email, paymentIntent.id);

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
};

