import { NextResponse } from 'next/server';
import { getStripeSettings, isDBConfigured } from '@/lib/db';

export async function GET() {
  try {
    const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const dbSettings = isDBConfigured() ? await getStripeSettings() : { publishableKey: null };
    const publishableKey = dbSettings.publishableKey || envKey;
    
    if (!publishableKey) {
      return NextResponse.json(
        { error: 'Stripe publishable key not configured' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ publishableKey });
  } catch (error) {
    console.error('Error fetching Stripe publishable key:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching Stripe configuration' },
      { status: 500 }
    );
  }
}
