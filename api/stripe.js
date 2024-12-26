import express from 'express';
import stripePackage from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const stripe = stripePackage('sk_test_51QQ0a1JNKAgioTIIyuqzwX1x51dfnhHdNeC1s7HxMreE8QwAqQen6y9FnFJmVkRxGYZbUu4d4JqmH579EBW67bi500ZUdngC4e');

app.use(cors());
app.use(bodyParser.json());

// Create payment intent
app.post('/api/create-payment', async (req, res) => {
  try {
    const { email, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 5000,
      currency: 'usd',
      metadata: { email },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(400).json({ error: { message: error.message } });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));