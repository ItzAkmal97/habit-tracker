import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Payment';

const stripePromise = loadStripe('pk_test_51QQ0a1JNKAgioTIIrYebZfXORts5HSrwBnoZL6oAjs1Wtkt0tudYb61YDBNeht3H3RB9dfbqbYsmMYUMFeiwArER00YoPFbgfo');

const StripeWrapper:React.FC = () => (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  );
  
  export default StripeWrapper;