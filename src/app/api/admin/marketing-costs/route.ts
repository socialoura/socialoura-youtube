import { NextRequest, NextResponse } from 'next/server';
import { getMarketingCosts, initDatabase, upsertMarketingCost } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Initialize database on module load
initDatabase().catch(console.error);

function verifyToken(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.exp && decoded.exp > Date.now()) {
      return decoded.role === 'admin';
    }
    return false;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || null;

    if (!verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await getMarketingCosts();
    const costs: Record<string, number> = {};

    rows.forEach((row) => {
      costs[row.month] = Number(row.google_ads_cost) || 0;
    });

    return NextResponse.json({ costs });
  } catch (error) {
    console.error('Error fetching marketing costs:', error);
    return NextResponse.json({ error: 'An error occurred while fetching marketing costs' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || null;

    if (!verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { month, googleAdsCost } = body;

    if (typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: 'Invalid month. Expected YYYY-MM' }, { status: 400 });
    }

    const parsed = Number(googleAdsCost);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return NextResponse.json({ error: 'Invalid googleAdsCost. Must be a number >= 0' }, { status: 400 });
    }

    await upsertMarketingCost(month, parsed);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating marketing cost:', error);
    return NextResponse.json({ error: 'An error occurred while updating marketing cost' }, { status: 500 });
  }
}
