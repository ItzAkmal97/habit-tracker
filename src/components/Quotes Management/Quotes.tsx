import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface Quote {
  id: string;
  quote: string;
  author: string;
}

const Quotes: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://dummyjson.com/quotes/random");

      if (!response.ok) {
        throw new Error("Failed to fetch quotes");
      }

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
    const interval = setInterval(fetchQuotes, 100000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
      <div className="flex justify-end">
        <Button
          onClick={fetchQuotes}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2 dark:bg-gray-900 bg-gray-600 text-white"
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
        <Card key={quote.id}>
          <CardContent className="pt-6 dark:bg-gray-800">
            <blockquote className="space-y-2">
              <p className="text-lg text-gray-700 dark:text-white">
                "{quote.quote}"
              </p>
              <footer className="text-sm text-gray-500 dark:text-gray-300">
                — {quote.author}
              </footer>
            </blockquote>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quotes;
