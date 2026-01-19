'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ReactNode, useMemo, useEffect, useState } from 'react';

// Cache for Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;
let cachedPublishableKey: string | null = null;

const getStripe = async () => {
  // Fetch publishable key from API (checks database first, then env)
  try {
    const response = await fetch('/api/stripe-config');
    if (response.ok) {
      const data = await response.json();
      const publishableKey = data.publishableKey;
      
      if (publishableKey && publishableKey !== cachedPublishableKey) {
        // Reset promise if key changed
        cachedPublishableKey = publishableKey;
        stripePromise = loadStripe(publishableKey);
      } else if (!stripePromise && publishableKey) {
        // Initialize for the first time
        cachedPublishableKey = publishableKey;
        stripePromise = loadStripe(publishableKey);
      }
    } else {
      console.error('Failed to fetch Stripe configuration');
    }
  } catch (error) {
    console.error('Error fetching Stripe configuration:', error);
  }
  
  return stripePromise;
};

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({ 
  children, 
  clientSecret,
}: StripeProviderProps) {
  const [stripePromiseState, setStripePromiseState] = useState<Promise<Stripe | null> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initStripe = async () => {
      await getStripe(); // This initializes the global stripePromise
      setStripePromiseState(stripePromise); // Use the global variable
      setIsLoading(false);
    };
    initStripe();
  }, []);

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => {
    if (clientSecret) {
      return {
        clientSecret,
        appearance: {
          theme: 'night' as const,
          variables: {
            colorPrimary: '#a855f7', // Purple-500
            colorBackground: '#1f2937', // Gray-800
            colorText: '#f3f4f6', // Gray-100
            colorTextSecondary: '#9ca3af', // Gray-400
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '12px',
            colorInputBackground: '#374151', // Gray-700
            colorInputText: '#f3f4f6', // Gray-100
          },
          rules: {
            '.Input': {
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              color: '#f3f4f6',
            },
            '.Input:focus': {
              border: '1px solid #a855f7',
              boxShadow: '0 0 0 1px #a855f7',
            },
            '.Label': {
              color: '#9ca3af',
            },
            '.Tab': {
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              color: '#9ca3af',
            },
            '.Tab:hover': {
              backgroundColor: '#4b5563',
              color: '#f3f4f6',
            },
            '.Tab--selected': {
              backgroundColor: '#a855f7',
              border: '1px solid #a855f7',
              color: '#ffffff',
            },
            '.TabIcon': {
              fill: '#9ca3af',
            },
            '.TabIcon--selected': {
              fill: '#ffffff',
            },
          },
        },
      };
    }
    return undefined;
  }, [clientSecret]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-gray-500">Loading payment system...</p>
      </div>
    );
  }

  if (!stripePromiseState) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-gray-500">
          Stripe is not properly configured. Please check your environment variables.
        </p>
      </div>
    );
  }

  if (!clientSecret || !options) {
    return <>{children}</>;
  }

  return (
    <Elements stripe={stripePromiseState} options={options}>
      {children}
    </Elements>
  );
}
