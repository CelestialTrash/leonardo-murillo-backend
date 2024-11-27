const Stripe = require("stripe");
const nodemailer = require("nodemailer");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

// Function to send email
async function sendEmail(customerEmail, sessionId, formData) {
  try {
    console.log("Setting up email transport...");
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "murirami.work@gmail.com", // Leonardo's email
      subject: "Order Confirmation",
      text: `
        New Order Details:
        - Session ID: ${sessionId}
        - Customer Email: ${customerEmail}
        - Shipping Address:
          Name: ${formData.name}
          Address: ${formData.address}
          City: ${formData.city}
          State: ${formData.state}
      `,
    };

    console.log("Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error in sendEmail function:", error.message);
    throw new Error("Email sending failed");
  }
}

// Stripe Checkout session creation
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
          name: `${item.name} - ${item.material || "N/A"}`,
          description: `Color: ${item.color || "N/A"}, Switch: ${item.switchType || "N/A"}`,
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://murirami.netlify.app/success`,
      cancel_url: `https://murirami.netlify.app/cancel`,
      metadata: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
      },
    });

    // Attempt to send the email
    console.log("Creating checkout session and sending email...");
    await sendEmail(formData.email, session.id, formData);

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error.message);
    res.status(500).json({ error: "Failed to create checkout session or send email." });
  }
};
