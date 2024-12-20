import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Quote as QuoteIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Quote {
  id: string;
  quote: string;
  author: string;
}

const INTERVAL_TIME = 100000;

const Quotes: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const resData = await response.json();
      setQuote(resData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-[calc(60vh-theme(space.16))] lg:max-w-[calc(90vh-theme(space.16))] p-4 md:p-8 bg-gray-300 dark:bg-slate-600">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button
            onClick={fetchQuotes}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-white transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            New Quote
          </Button>
        </div>

        {quote && (
          <Card className="border-0 shadow-2xl">
            <CardContent className="pt-6 bg-white dark:bg-gray-800 relative">
              <blockquote className="space-y-4">
                <div className="flex gap-2">
                  <QuoteIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  <p className="text-lg text-gray-700 dark:text-white leading-relaxed">
                    {quote.quote}
                  </p>
                </div>
                <footer className="text-sm text-gray-500 dark:text-gray-300 font-medium pl-8">
                  — {quote.author}
                </footer>
              </blockquote>
            </CardContent>
            <motion.div
              className=" h-1 bg-black dark:bg-gray-500 rounded-t-lg"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: INTERVAL_TIME / 1000, ease: "linear" }}
              key={quote.id}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Quotes;
