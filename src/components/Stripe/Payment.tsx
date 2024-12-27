import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import { setShowToast } from "@/features/loginSignupSlice";
import { saveDarkModeAccess, setDarkMode } from "@/features/darkModeSlice";

interface RootState {
  loginSignup: {
    showToast: boolean;
  };
}

const Payment: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const showToast = useSelector(
    (state: RootState) => state.loginSignup.showToast
  );

  const handleCloseToast = () => {
    dispatch(setShowToast(false));
  };

  const email = localStorage.getItem("email") ?? "";

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://habit-tracker-pi-blue.vercel.app/api/create-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount: 5000 }),
        }
      );

      const { clientSecret } = await response.json();

      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement) as StripeCardElement,
            billing_details: { email },
          },
        });

      if (paymentError) throw paymentError;

      if (paymentIntent.status === "succeeded") {

        localStorage.setItem("darkModeAccess", "true");

        // Update Firebase
        
        await saveDarkModeAccess("true");

        // Update Redux state
        dispatch(setDarkMode(true));

        setSuccess(true);
        setToastMessage("Payment successful! Dark mode activated.");
        dispatch(setShowToast(true));

        setTimeout(() => {
          dispatch(setShowToast(false));
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      setToastMessage(errorMessage);
      dispatch(setShowToast(true));

      setTimeout(() => {
        dispatch(setShowToast(false));
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      {showToast && (
        <Toast
          className={`fixed top-0 ${
            success
              ? "bg-green-50 dark:bg-green-900"
              : "bg-red-50 dark:bg-red-900"
          }`}
          onOpenChange={handleCloseToast}
        >
          <div className="flex items-center">
            {success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <div>
              <ToastTitle
                className={
                  success
                    ? "text-green-800 dark:text-green-100"
                    : "text-red-800 dark:text-red-100"
                }
              >
                {success ? "Success" : "Error"}
              </ToastTitle>
              <ToastDescription
                className={
                  success
                    ? "text-green-600 dark:text-green-200"
                    : "text-red-600 dark:text-red-200"
                }
              >
                {toastMessage}
              </ToastDescription>
            </div>
          </div>
        </Toast>
      )}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md border-gray-200 dark:border-gray-800">
          <CardHeader>
            <h1 className="text-lg flex items-center">
              <CreditCard className="mr-2" /> Dark Mode Access
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              One-time payment of $50 for permanent access
            </p>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Card Details</Label>
              <div className="border rounded-md p-3 dark:border-gray-700">
                <CardElement />
              </div>
              {error && (
                <p className="text-red-500 dark:text-red-400">{error}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handlePayment}
              disabled={loading || email.trim() === ""}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </span>
              ) : (
                "Pay $50"
              )}
            </Button>
          </CardFooter>
        </Card>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default Payment;
