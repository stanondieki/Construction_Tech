/**
 * API Ping Endpoint
 * Simple endpoint to check if the server is online
 */
import { NextRequest, NextResponse } from 'next/server';

export async function HEAD(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'online' });
}
